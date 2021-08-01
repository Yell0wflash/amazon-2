function getItems() {
    db.collection("items").get().then((querySnapshot) => {
        let items = [];
        querySnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                image: doc.data().image,
                name: doc.data().name,
                make: doc.data().make,
                rating: doc.data().rating,
                price: doc.data().price
            })
        });
        generateItems(items);
    });
}

function generateItems(items) {
    items.forEach(item => {
        let doc = document.createElement('div');
        doc.classList.add('main-product', 'my-5');

        doc.innerHTML = `
            <div class="product-image w-48 h-52 p-4 bg-white rounded-lg">
                <img class="w-full h-full object-contain cursor-pointer"
                    src="${item.image}"
                    alt="Image of ${item.name}">
            </div>
            <div
                class="product-name text-gray-700 font-bold mt-2 text-sm w-48 flex-wrap">
                ${item.name}
            </div>
            <div
                class="product-make cursor-pointer text-pink-800 hover:text-blue-600 font-bold text-sm w-48 flex-wrap">
                ${item.make}
            </div>
            <div class="product-rating text-gray-700 font-bold my-1">
                ⭐⭐⭐⭐⭐ ${item.rating}
            </div>
            <div class="product-price text-gray-700 font-bold text-lg">
                ${numeral(item.price).format('$0,0.00')}
            </div>
        `;

        let addToCartElement = document.createElement('div');
        addToCartElement.classList.add('add-to-cart-button', 'bg-pink-300', 'hover:bg-blue-300', 'w-24', 'mt-2', 'p-2', 'rounded-md', 'text-gray-700', 'text-sm', 'font-bold', 'flex', 'justify-center', 'items-center', 'cursor-pointer');
        addToCartElement.innerHTML = 'Add to Cart';
        addToCartElement.addEventListener("click", function () {
            addToCart(item);
        });
        doc.appendChild(addToCartElement);
        document.querySelector(".deals").appendChild(doc);
    })
}

function addToCart(item) {
    console.log(`${item.name} was added to cart.`);

    let cartItem = db.collection("cart-items").doc(item.id);

    cartItem.get()
        .then(function (doc) {
            if (doc.exists) {
                cartItem.update({
                    quantity: doc.data().quantity + 1
                })
            }
            else {
                cartItem.set({
                    image: item.image,
                    name: item.name,
                    make: item.make,
                    rating: item.rating,
                    price: item.price,
                    quantity: 1
                })
            }
        })
}

getItems();