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


// Beispiel: Klick-Event-Listener für die Navigationselemente
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        alert(`You clicked on ${item.querySelector('span').textContent}`);
    });
});
