import menuArray from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const purchaseItemsContainer = document.getElementById('purchase-items-container')
const totalPrice = document.getElementById('total-price')
const orderContainer = document.getElementById('order-container')
const payModal = document.getElementById('pay-modal')
const itemContainer = document.getElementById('item-container')
const confirmationMessage = document.getElementById('confirmation-msg')
let order = []

renderItems()

document.addEventListener('click', (evt) => {
    if (evt.target.dataset.add) {
        const itemId = evt.target.dataset.add
        const newItemObj = {}
        newItemObj.uuid = uuidv4()
        newItemObj.itemId = parseInt(itemId)
        order.push(newItemObj)
        renderOrder()
    } else if (evt.target.dataset.remove) {
        const removeUuid = evt.target.dataset.remove
        const removeIndex = order.findIndex(orderItem => orderItem.uuid === removeUuid)
        order.splice(removeIndex, 1)
        renderOrder()
    } else if (evt.target.id === "complete-btn") {
        payModal.style.display = "flex"
    } else if (evt.target.id === "cancel-modal-btn") {
        evt.preventDefault()
        payModal.reset()
        payModal.style.display = "none"
    } else if (evt.target.id === "confirm-pay-btn") {
        evt.preventDefault()
        if (payModal.checkValidity()) {
            const formData = new FormData(payModal)
            const name = formData.get("fullName")
            const cardNumber = formData.get("cardNumber")
            const CVV = formData.get("cvv")
            payModal.style.display = "none"
            order = []
            renderItems()
            payModal.reset()
            showConfirmation(name)
        } else { payModal.reportValidity() }
    }
})

function showConfirmation(name) {
    const message = `Thanks, ${name}! Your order is on its way!`
    confirmationMessage.innerText = message
    confirmationMessage.style.display = "block"
}

function renderOrder() {
    if (order.length > 0) {
        orderContainer.style.display = "flex"
        let totalCost = 0
        let orderHtml = ''

        order.forEach(orderItem => {
            const item = menuArray.find(item => orderItem.itemId === item.id)
            totalCost += item.price

            orderHtml += `<div class="purchase-card">
                    <div class="purchase-item-name">${item.name}</div>
                    <button class="remove-btn" data-remove=${orderItem.uuid}>remove</button>
                    <div class="purchase-item-price">$${item.price}</div>
                    </div>
                    `
        })
        purchaseItemsContainer.innerHTML = orderHtml
        totalPrice.textContent = `$${totalCost}`
    } else {
        orderContainer.style.display = "none"
    }
}

function renderItems() {
    itemContainer.innerHTML = getItemsHtml()
    renderOrder()
}

function getItemsHtml() {
    let itemHtml = ''

    menuArray.forEach(item => {
        itemHtml += `
        <div class="item-card">
            <p class="emoji">${item.emoji}</p>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-ingredients">${item.ingredients.map(ingredient => `${ingredient}`
        ).join(', ')
            }</div >
            <div class="item-price">$${item.price}</div>
            </div >
            <div class="add-btn" id="add-btn" >
                <img src="/images/ellipse.png" class="ellipse" data-add="${item.id}"/>
                <p>+</p>
            </div>
        </div > `
    })
    return itemHtml
}