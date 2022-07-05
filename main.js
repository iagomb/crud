'use strict'

const openModal = () => document.querySelector('#modal')
                    .classList.add('active');
const closeModal = () => {
    clearFields()
    document.querySelector('#modal').classList.remove('active');
}

// O método getItem('chave') da interface Storage, ao passar um nome de chave, retornará o valor dessa chave, ou null se a chave não existir, no objeto Storage fornecido.
// pegue o que tem no localStorage e transforme em JSON e armazena na variavel db_client
//JSON.parse(localStorage.getItem('db_client') se não existir retorne um array vazio
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? [];
// setItem('chave', 'o seu valor') envia os dados para o localStorage
const setLocalStorage = (dbClient) => localStorage.setItem("dbClient", JSON.stringify(dbClient));

// CRUD  - create read update delete
const createClient = (client) => {
    //const arr = 
    const dbClient = getLocalStorage()
    // push() acressenta mais um
    dbClient.push(client)
    setLocalStorage(dbClient)
}


const readClient = () => getLocalStorage()
readClient()
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const deleteClient = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}
// Interação com o layout
const isValidateFields = () => {
    // O método HTMLFormElement.reportValidity() retorna true se os controles filho do elemento satisfizerem suas restrições de validação. Quando false é retornado, eventos inválidos canceláveis ​​são acionados para cada filho inválido e os problemas de validação são relatados ao usuário.
    // retorna verdadeiro se todos os requesitos do html foram atendidos
    return document.getElementById('form').reportValidity()
}
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}
const saveClient = () => {
    if (isValidateFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        }else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML =`
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    //Os nós Document e DocumentFragment nunca podem ter um pai, então parentNode sempre retornará null. Ele também retorna null se o nó acabou de ser criado e ainda não está anexado à árvore.
    //remova um nó da árvore, a menos que não esteja na árvore já node.parentNode.removeChild(node);
    // o forEach 1 pegar o elemento e pecorre 2 pegar o index
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

updateTable()

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
    
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if(event.target.type == 'button') {
        // split paga a string retorna um array
        // id  e  posição 
        const [action, index] = event.target.id.split('-')
    console.log(action);

        if (action == 'edit') {
            editClient(index)
        }else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
        // if (event.target.innerHTML == 'Editar') {
        //     openModal()
        //     const dbClient = readClient()
        //     updateClient(dbClient)

        // }
    }
}



// Eventos

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveClient);
document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete);
