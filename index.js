import menuArray from "./data.js";

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
        order.push(parseInt(itemId))
        renderOrder()
    } else if (evt.target.dataset.remove) {
        const removeIndex = order.indexOf(parseInt(evt.target.dataset.remove))
        order.splice(removeIndex, removeIndex + 1)
        renderOrder()
    } else if (evt.target.id === "complete-btn") {
        payModal.style.display = "flex"
    } else if (evt.target.id === "confirm-pay-btn") {
        evt.preventDefault()
        if (payModal.checkValidity()) {
            const formData = new FormData(payModal)
            const name = formData.get("fullName")
            const cardNumber = formData.get("cardNumber")
            const CVV = formData.get("cvv")
            console.log(name, cardNumber, CVV)
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

        order.forEach(orderItemId => {
            const item = menuArray.find(item => orderItemId === item.id)
            totalCost += parseInt(item.price)

            orderHtml += `<div class="purchase-card">
                    <div class="purchase-item-name">${item.name}</div>
                    <button class="remove-btn" data-remove=${item.id}>remove</button>
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
                <img src="./images/Ellipse.png" class="elipse" data-add="${item.id}"/>
                <p>+</p>
            </div>
        </div > `
    })
    return itemHtml
}