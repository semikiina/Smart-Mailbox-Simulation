
async function fetchMailboxData() {
    try {
        const response = await fetch('http://localhost:3000/mailbox', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data received from API:', data);


        const infoDiv = document.getElementById('mailbox-info');
        infoDiv.innerHTML = `
            <p><strong>Total Weight:</strong> ${data.currentWeight} grams</p>
            <p><strong>Total Letters:</strong> ${data.mailCount}</p>
            <p><strong>Mailbox Full:</strong> ${data.isFull ? 'Yes' : 'No'}</p>
        `;

        const mailList = document.getElementById('mailList');
        mailList.innerHTML = '';

        const recentMails = data.receivedMails.slice(-10);
        recentMails.forEach(mail => {
            const mailItem = document.createElement('div');
            mailItem.classList.add('mail-item');
            mailItem.innerHTML = `
                <span class="new-mail">New Mail Arrived</span>
                <span class="date">${mail.timestamp}</span>
                <span class="weight">${mail.weight}g</span>
            `;
            mailList.appendChild(mailItem);
        });

        const fillLevel = document.querySelector('.fill-level');
        const maxWeight = 2000;
        const fillPercentage = Math.min((data.currentWeight / maxWeight) * 100, 100);
        fillLevel.style.height = `${fillPercentage}%`;

        if (data.isFull) {
            const newNotification = {
                id: new Date().toISOString(),
                text: '🚨 Mailbox is full, please empty it! 🚨',
            };
            addNotification(newNotification);
        }
    } catch (error) {
        console.error('Error fetching mailbox data:', error);
    }
}

function addNotification(notification) {
    const mailList = document.getElementById('mailList');
    const existingNotification = Array.from(mailList.children).find(child =>
        child.textContent.includes(notification.text)
    );

    if (!existingNotification) {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        notificationItem.innerHTML = `<p>${notification.text}</p>`;
        mailList.appendChild(notificationItem);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const emptyMailboxButton = document.getElementById('empty-mailbox-button');

    if (emptyMailboxButton) {
        emptyMailboxButton.addEventListener('click', () => {

            updateMailboxDisplay({ currentWeight: 0, mailCount: 0, isFull: false });

            fetch('http://localhost:3000/empty-mailbox', {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Mailbox successfully emptied:', data);
                    updateMailboxDisplay(data);
                })
                .catch(error => {
                    console.error('Error emptying mailbox:', error);
                });
        });
    }
});

function updateMailboxDisplay(data) {
    try {

        const weightElement = document.querySelector('p:nth-child(1)');
        if (weightElement) {
            weightElement.innerHTML = `<strong>Total Weight:</strong> ${data.currentWeight} grams`;
        }

        const countElement = document.querySelector('p:nth-child(2)');
        if (countElement) {
            countElement.innerHTML = `<strong>Total Letters:</strong> ${data.mailCount}`;
        }

        const fullStatusElement = document.querySelector('p:nth-child(3)');
        if (fullStatusElement) {
            fullStatusElement.innerHTML = `<strong>Mailbox Full:</strong> ${data.isFull ? 'Yes' : 'No'}`;
        }

        const fillLevel = document.querySelector('.fill-level');
        const maxWeight = 2000;
        const fillPercentage = Math.min((data.currentWeight / maxWeight) * 100, 100);
        fillLevel.style.height = `${fillPercentage}%`;

        if (!data.isFull && data.currentWeight === 0) {
            fillLevel.style.height = '0%';
        }
    } catch (error) {
        console.error('Error updating mailbox display:', error);
    }
}

fetchMailboxData();

setInterval(fetchMailboxData, 5000);