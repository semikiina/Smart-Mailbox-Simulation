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
// Fetch mailbox data on page load
fetchMailboxData();

// Fetch mailbox data every 5 seconds
setInterval(fetchMailboxData, 5000);