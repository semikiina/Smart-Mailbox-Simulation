async function fetchMailboxData() {
    try {
        const response = await fetch('http://localhost:3000/mailbox');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Update mailbox status
        const infoDiv = document.getElementById('mailbox-info');
        infoDiv.innerHTML = `
            <p><strong>Total Weight:</strong> ${data.currentWeight} grams</p>
            <p><strong>Total Letters:</strong> ${data.mailCount}</p>
            <p><strong>Mailbox Full:</strong> ${data.isFull ? 'Yes' : 'No'}</p>
        `;

        // Check if the mailbox is full and add a notification
        if (data.isFull) {
            const notificationMessage = 'Mailbox is full! Please empty it.';
        }

        // Update mail list with only the last 10 mails
        const mailList = document.getElementById('mailList');
        mailList.innerHTML = ''; // Clear existing mail list

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

        // Update mailbox fill level
        const fillLevel = document.querySelector('.fill-level');
        const maxWeight = 2000; // Assume maximum weight capacity of mailbox in grams
        const fillPercentage = Math.min((data.currentWeight / maxWeight) * 100, 100); // Limit to 100%
        fillLevel.style.height = `${fillPercentage}%`; // Set height based on percentage
    } catch (error) {
        console.error('Error fetching mailbox data:', error);
    }
}

// Warte auf das vollständige Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    const emptyMailboxButton = document.getElementById('empty-mailbox-button');

    // Überprüfe, ob der Button gefunden wurde
    if (emptyMailboxButton) {
        emptyMailboxButton.addEventListener('click', () => {
            fetch('http://localhost:3000/empty-mailbox', {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Mailbox successfully emptied:', data);
                    // Optionale Aktion: Die Mailbox-Daten im UI aktualisieren
                    updateMailboxDisplay(data);
                })
                .catch(error => {
                    console.error('Fehler beim Leeren der Mailbox:', error);
                });
        });
    } else {
        console.error('Der Button "empty-mailbox-button" wurde nicht gefunden!');
    }
});

function updateMailboxDisplay(data) {
    try {
        // Total Weight aktualisieren
        const weightElement = document.querySelector('p:nth-child(1)');
        if (weightElement) {
            weightElement.innerHTML = `<strong>Total Weight:</strong> ${data.currentWeight} grams`;
        }

        // Total Letters aktualisieren
        const countElement = document.querySelector('p:nth-child(2)');
        if (countElement) {
            countElement.innerHTML = `<strong>Total Letters:</strong> ${data.mailCount}`;
        }

        // Mailbox Full Status aktualisieren
        const fullStatusElement = document.querySelector('p:nth-child(3)');
        if (fullStatusElement) {
            fullStatusElement.innerHTML = `<strong>Mailbox Full:</strong> ${data.isFull ? 'Yes' : 'No'}`;
        }

        // Update mailbox fill level
        const fillLevel = document.querySelector('.fill-level');
        const maxWeight = 2000; // Maximum weight capacity of the mailbox in grams
        const fillPercentage = Math.min((data.currentWeight / maxWeight) * 100, 100); // Limit to 100%

        fillLevel.style.height = `${fillPercentage}%`; // Set height based on percentage

        // Wenn die Mailbox geleert wurde (Daten zurückgesetzt werden)
        if (!data.isFull && data.currentWeight === 0) {
            fillLevel.style.height = '0%'; // Setze den Füllstand zurück
        }
    } catch (error) {
        console.error('Error fetching mailbox data:', error);
    }
}

// Fetch mailbox data on page load
fetchMailboxData();

// Fetch mailbox data every 5 seconds
setInterval(fetchMailboxData, 5000);