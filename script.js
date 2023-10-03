
async function fetchPartyData() {
    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching party data:', error);
    }
};

function renderPartyList(partyData) {
    const partyList = document.getElementById('partyList');

    partyList.innerHTML = '';

    if (partyData.length === 0) {
        partyList.innerHTML = '<li>No parties available.</li>';
    } else {
        partyData.forEach(party => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Name:</strong> ${party.name}<br>
                <strong>Date:</strong> ${party.date}<br>
                <strong>Time:</strong> ${party.time}<br>
                <strong>Location:</strong> ${party.location}<br>
                <strong>Description:</strong> ${party.description}<br>
                <button onclick="deleteParty('${party.id}')">Delete</button>
            `;
            partyList.appendChild(listItem);
        });
    }
};

async function addNewParty(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const partyDetails = {
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description')
    };

    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partyDetails)
        });

        if (response.ok) {
            const updatedPartyData = await fetchPartyData();
            renderPartyList(updatedPartyData);
            form.reset();
        } else {
            console.error('Failed to add new party');
        }
    } catch (error) {
        console.error('Error adding new party:', error);
    }
};

async function deleteParty(partyId) {
    try {
        const response = await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events/${partyId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const updatedPartyData = await fetchPartyData();
            renderPartyList(updatedPartyData);
        } else {
            console.error('Failed to delete party');
        }
    } catch (error) {
        console.error('Error deleting party:', error);
    }
};

async function initializePage() {
    const partyData = await fetchPartyData();
    renderPartyList(partyData);
}

window.addEventListener('load', initializePage);
