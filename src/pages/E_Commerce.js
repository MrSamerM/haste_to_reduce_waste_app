import React, { useEffect, useState } from "react";
import '../styling/E_Commerce.css'
import axios from "axios";

function E_Commerce() {

    const [productList, setProductList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);



    useEffect(() => {
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

    }, []);


    // from chatGPT mycode(it still updates all)

    const add = (productId, cost) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
        }));
        setTotalAmount(prevTotalAmount => prevTotalAmount === 0 ? prevTotalAmount - 0 : prevTotalAmount - cost);

    };

    const subtract = (productId, cost) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0), // Prevent negative values
        }));
        setTotalAmount(prevTotalAmount => prevTotalAmount + cost);
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