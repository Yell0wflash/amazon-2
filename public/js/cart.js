function getCartItems() {
    db.collection("cart-items").onSnapshot((snapshot) => {
        let cartItems = [];
        snapshot.forEach((doc) => {
            cartItems.push({
                id: doc.id,
                ...doc.data() // ... will get all the data
            })
        });
        generateCartItems(cartItems);
        getTotalCost(cartItems);
    })
}

function generateCartItems(cartItems) {
    let itemsHTML = "";

    cartItems.forEach((item) => {
        itemsHTML += `
            <div class="cart-item flex items-center py-5 border-b border-purple-200">
                <div class="item-image w-40 h-32 p-4 bg-white rounded-lg mr-5">
                    <img class="w-full h-full object-contain"
                        src="${item.image}"
                        alt="Image of ${item.name}">
                </div>
                <div class="item-details flex-1 flex-wrap mr-4">
                    <div class="item-name text-gray-700 font-bold text-sm">
                        ${item.name}
                    </div>
                    <div class="item-make text-gray-700 text-sm">
                        ${item.make}
                    </div>
                </div>
                <div class="item-counter text-gray-700 w-48 flex items-center">
                    <div data-id=${item.id} class="item-decrease h-6 w-6 hover:bg-gray-100 flex justify-center items-center bg-white rounded cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <h4 class="text-l w-6 mx-2 text-center">${item.quantity}</h4>
                    <div data-id=${item.id} class="item-increase h-6 w-6 hover:bg-gray-100 flex justify-center items-center bg-white rounded cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
                <div class="item-total-cost w-40 text-gray-600 flex items-center font-bold">
                    ${numeral(item.price * item.quantity).format('$0,0.00')}
                </div>
                <div data-id=${item.id} class="item-delete w-6 h-6 flex justify-center items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        `;
    })
    document.querySelector(".cart-items").innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners() {
    let decreaseButtons = document.querySelectorAll(".item-decrease");
    let increaseButtons = document.querySelectorAll(".item-increase");
    let deleteButtons = document.querySelectorAll(".item-delete");

    decreaseButtons.forEach((button) => {
        button.addEventListener("click", function () {
            decreaseCount(button.dataset.id);
        })
    })
    increaseButtons.forEach((button) => {
        button.addEventListener("click", function () {
            increaseCount(button.dataset.id);
        })
    })
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            deleteItem(button.dataset.id);
        })
    })
}

function decreaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function (doc) {
        if (doc.exists && doc.data().quantity > 1) {
            cartItem.update({
                quantity: doc.data().quantity - 1
            })
        }
    })
}

function increaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function (doc) {
        if (doc.exists) {
            cartItem.update({
                quantity: doc.data().quantity + 1
            })
        }
    })
}

function deleteItem(itemId) {
    db.collection("cart-items").doc(itemId).delete();
}

function getTotalCost(cartItems) {
    let totalCost = 0;

    cartItems.forEach((item) => {
        totalCost += (item.price * item.quantity);
    })
    document.querySelector(".total-cost-number").innerHTML = numeral(totalCost).format('$0,0.00');
}

getCartItems();