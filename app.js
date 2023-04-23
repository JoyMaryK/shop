class Product{
    //deal with a single product

    constructor(product){
        this.product=product
    }

    render(){
        //rendering a single product
        let html = `
        
        <div class="item">
        <img src=${this.product.productImg} alt="${this.product.productName}" >
        <div class="product-item__content">
          <h2>${this.product.productName}</h2>
          <h3>\$ ${this.product.productPrice}</h3>
          <p>${this.product.productDescription}</p>
          <button onclick="new Product().addToCart(${this.product.id})">Add to cart</button>
          <button onclick="new Product().updateProduct(${this.product.id})">update</button>
         <button onclick="new Product().deleteProduct(${this.product.id})" ><ion-icon name="trash-outline"></ion-icon></button>
        </div>
     </div>
        
        `

        return html
    }
    async deleteProduct(id) {
        await fetch(`http://localhost:3000/products/${id}`, {
            method:'DELETE',
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    async updateProduct(id){
        const response = await fetch(`http://localhost:3000/products/${id}`)
        const product = await response.json()
      
       this.prePopulate(product)
       const btn = document.querySelector("#btn")
       btn.addEventListener('click', (e)=>{
        e.preventDefault()
        
        const updatedProduct= new Product().readValues();
        if(btn.innerText==="Update Product"){
            console.log("Updating");
            this.sendUpdate({...updatedProduct, id})
           }
       })

    }

    async sendUpdate(product){
        
        await fetch(`http://localhost:3000/products/${product.id}`, {
            method:'PUT',
            body:JSON.stringify(product),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    prePopulate(product){
        document.querySelector("#p_name").value=product.productName
        document.querySelector("#p_image").value = product.productImg
        document.querySelector("#p_price").value =product.productPrice
        document.querySelector("#p_description").value=product.productDescription
        document.querySelector("#btn").textContent= `Update Product`
    }

    readValues(){
        const productName= document.querySelector("#p_name").value
        const productImg = document.querySelector("#p_image").value
        const productPrice =document.querySelector("#p_price").value
        const productDescription =document.querySelector("#p_description").value
        return {productName,productImg,productDescription, productPrice};
    }
    async addProduct(){
        const newProduct =new Product().readValues();
        await fetch(' http://localhost:3000/products', {
            method:'POST',
            body:JSON.stringify(newProduct),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }

    async addToCart(id){
        
        const selectedProductResponse = await fetch(`http://localhost:3000/products/${id}`)
        const  selectedProduct = await selectedProductResponse.json()
        const another = JSON.stringify(selectedProduct)
       // console.log(selectedProduct);
        const selected = another.replace("\"id\":", "\"prodId\":");  
          

       // console.log(selected);
        
        await fetch("http://localhost:3000/cart",{
            method:'POST',
            body: selected,
            headers:{
                "Content-Type": "application/json"
            }

        })
    }
}


   
    async function getItemsInCart(){
        const response = await fetch("http://localhost:3000/cart")
        const carts = await response.json()
       // console.log(carts);
       let html = ` <div class= "up">
       <h3> Items in cart: </h3>
                    <p onclick="closeCart()" style= "background-color:gray; ">close<p>
                     </div>
       
                    `
        carts.forEach(item => {
            let htmlItem = `<div class="each-item">
            <img src="${item.productImg}" style= "width:2rem; height:2rem; " alt="image">
            <p>${item.productName}<p>
            <p>$ ${item.productPrice}</p>
           
        </div> `
        html+=htmlItem
        });
        const cartDetails = document.querySelector(".cart")
        cartDetails.style["display"]= "block"
        cartDetails.innerHTML = html

         closeCart=()=>{cartDetails.style["display"]= "none"}
    }


const btn = document.querySelector("#btn")

    btn.addEventListener('click', ()=>{
        if(btn.innerText==='Add Product'){
            new Product().addProduct()
        }
    })

const btnCart = document.querySelector(".add-to-cart")
btnCart.addEventListener("click",getItemsInCart)

class ProductList{
//deal with all products

     async render(){
        //get list of products and render- api call
        let products= await this.fetchProduct()
      //  console.log(Object.keys(products).length);
        let html=''
        for(let product of products){
            const productHTML = new Product(product).render()
            html +=productHTML
        }
        return html
     }

     async fetchProduct(){
        const response = await fetch('http://localhost:3000/products')
        const products = await response.json()
        return products
     }

    }


class App{
    static async Init(){
        let productList=new ProductList()
        let htmlProducts = await productList.render()
        // console.log((htmlProducts));
        let app= document.querySelector('#app')
        app.innerHTML=htmlProducts

        const response = await fetch("http://localhost:3000/cart")
        const carts = await response.json()
        const itemsInCartNo = document.querySelector(".add-to-cart span")
        itemsInCartNo.innerHTML = "(" +Object.keys(carts).length + ")"
        
    }    
}


App.Init()
// class CustomElement extends HTMLElement{
//     static async Init(){
//         let productList=new ProductList()
//         let htmlProducts = await productList.render()
//         // console.log((htmlProducts));
//         let app= document.querySelector('#app')
//         app.innerHTML=htmlProducts
//     }  
// }
// CustomElement.Init()
// CustomElement.define( "product-item" , CustomElement);

