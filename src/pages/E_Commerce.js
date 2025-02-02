import React, { useEffect, useState } from "react";
import '../styling/E_Commerce.css'
import axios from "axios";

function E_Commerce() {

    const [productList, setProductList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [listOfProducts, setListOfProducts] = useState([]);



    useEffect(() => {

        console.log("Total: ", totalAmount)
        console.log("List of Products: ", listOfProducts)

        const products = async () => {
            try {
                const res = await axios.get('http://localhost:8000/allProducts')
                const allProducts = res.data.result.map((data) => ({ id: data._id, image: data.productImage, productName: data.productName, cost: data.pointCost, quantity: data.quantity }));
                setProductList(allProducts);

            } catch (err) {
                console.log("Error", err)
            }
        }
        products();

    }, [totalAmount, listOfProducts]);


    // from chatGPT Prompt: mycode  it still updates all (my code): for setQuantities 02/02/2025

    // Prompt: The thing is setListOfProducts(prevListOfProducts => prevListOfProducts.filter(id=>id!==productId)),
    // It may have repeated products ids if a users buys the same thing more than once. so would this remove all of the same ids, or only one. 
    // ^^: for setListOfProducts 

    const add = (productId, cost) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
        }));
        setTotalAmount(prevTotalAmount => prevTotalAmount + cost);
        setListOfProducts(prevListOfProducts => [...prevListOfProducts, productId]);
    };

    const subtract = (productId, cost) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0), // Prevent negative values
        }));
        setTotalAmount(prevTotalAmount => prevTotalAmount === 0 ? prevTotalAmount - 0 : prevTotalAmount - cost);
        setListOfProducts(prevListOfProducts => {
            const index = prevListOfProducts.indexOf(productId);
            const update = [...prevListOfProducts];
            update.splice(index, 1);
            return update;
        });
    };

    return (
        <div>
            <div id="shopTitleDiv"><h1 id="shopTitle">Prevention Shop</h1></div>

            <div id="shopItems">
                {productList.map((product) => (
                    <div id="productDiv">
                        <img src={product.image} id="productImage" />

                        <div className="groupedDiv">
                            <label className="productLabel" htmlFor="productName">Description: </label>
                            <input className="productInput" id="productName" value={product.productName} readonly />
                        </div>

                        <div className="groupedDiv">
                            <label className="productLabel" htmlFor="productCost">Cost: </label>
                            <input className="productInput" id="productCost" value={product.cost} readonly />
                        </div>

                        <div id="quantity">
                            <button className="addOrSubtract" onClick={() => subtract(product.id, product.cost)}>-</button>
                            <input key={product.id} id="quantityRequired" value={quantities[product.id] || 0} readonly />
                            <button className="addOrSubtract" onClick={() => add(product.id, product.cost)}>+</button>
                        </div>

                    </div>
                )
                )}

            </div>
        </div>
    );
}

export default E_Commerce;