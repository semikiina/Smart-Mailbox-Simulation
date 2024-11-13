// Dynamische Daten für das Beispiel
const totalWeight = 221;
const daysNotEmptied = 5;
const percentageFull = 24;

document.querySelector('.total-weight').textContent = `${totalWeight}g`;
document.querySelector('.days-not-emptied').textContent = `${daysNotEmptied} days`;
document.querySelector('.percentage').textContent = `${percentageFull}%`;

// Füllelement aktualisieren
const fillLevelElement = document.querySelector('.fill-level');
fillLevelElement.style.height = `${percentageFull}%`;


document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Beispiel: Wechsel zur Zielseite
        const targetPage = item.querySelector('span').textContent.toLowerCase(); // Zum Beispiel den Namen des Ziels
        window.location.href = `${targetPage}.html`;  // Navigiere zu targetPage.html
    });
});

// Funktion zum Setzen der initialen Daten in der Mailbox
function initializeMailbox() {
    const initialMails = [
        { date: '16.09.2024 - 11:44', weight: '10g' },
        { date: '14.09.2024 - 16:23', weight: '82g' },
        { date: '14.09.2024 - 09:53', weight: '5g' },
        { date: '12.09.2024 - 10:02', weight: '124g' }
    ];

    let totalWeight = 0;

    // Mailbox-Daten initialisieren
    const mailList = document.querySelector('.mail-list');
    mailList.innerHTML = '';

    initialMails.forEach(mail => {
        const mailItem = document.createElement('div');
        mailItem.classList.add('mail-item');
        mailItem.innerHTML = `<span class="date">${mail.date}</span><span class="weight">${mail.weight}</span>`;
        mailList.appendChild(mailItem);

        // Gewicht hinzufügen
        totalWeight += parseInt(mail.weight);
    });

    // Initiale Werte für Gewicht und Füllstand setzen
    document.querySelector('.total-weight').textContent = `${totalWeight}g`;
    document.querySelector('.days-not-emptied').textContent = '5 days not emptied';
    document.querySelector('.percentage').textContent = `${Math.min((totalWeight / 500) * 100, 100).toFixed(0)}% full`;
    document.querySelector('.fill-level').style.height = `${Math.min((totalWeight / 500) * 100, 100)}%`;
}

// Funktion zum Leeren der Mailbox
function emptyMailbox() {
    // Setze die Werte auf null
    document.querySelector('.total-weight').textContent = '0g';
    document.querySelector('.days-not-emptied').textContent = '0 days not emptied';
    document.querySelector('.percentage').textContent = '0% full';
    document.querySelector('.fill-level').style.height = '0%';

    // Entferne alle bisherigen Mail-Einträge
    const mailList = document.querySelector('.mail-list');
    mailList.innerHTML = '';

    // Beispiel für das Hinzufügen neuer Mail-Daten nach dem Leeren
    setTimeout(() => {
        const newMails = [
            { date: '18.09.2024 - 10:30', weight: '12g' },
            { date: '17.09.2024 - 12:00', weight: '25g' },
            { date: '16.09.2024 - 08:45', weight: '40g' }
        ];

        let totalWeight = 0;

        // Neue Mail-Einträge hinzufügen
        newMails.forEach(mail => {
            const mailItem = document.createElement('div');
            mailItem.classList.add('mail-item');
            mailItem.innerHTML = `<span class="date">${mail.date}</span><span class="weight">${mail.weight}</span>`;
            mailList.appendChild(mailItem);

            // Gewicht hinzufügen
            totalWeight += parseInt(mail.weight);
        });

        // Aktualisiere den Gesamtfüllstand
        document.querySelector('.total-weight').textContent = `${totalWeight}g`;
        document.querySelector('.percentage').textContent = `${Math.min((totalWeight / 500) * 100, 100).toFixed(0)}% full`;
        document.querySelector('.fill-level').style.height = `${Math.min((totalWeight / 500) * 100, 100)}%`;

    }, 1000); // 1 Sekunde Verzögerung, um den leeren Zustand kurz anzuzeigen
}

// Initialisiere die Mailbox-Daten beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeMailbox);