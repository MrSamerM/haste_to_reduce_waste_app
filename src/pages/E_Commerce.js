import React, { useEffect, useState } from "react";
import '../styling/E_Commerce.css'
import axios from "axios";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'

function E_Commerce() {

    const [productList, setProductList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [listOfProducts, setListOfProducts] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Total: ", totalAmount)
        console.log("List of Products: ", listOfProducts)
        console.log("User Points: ", userPoints)

    }, [userPoints, totalAmount, listOfProducts]);

    useEffect(() => {
        const points = async () => {

            try {
                const secondRes = await axios.get('http://localhost:8000/userPoints')
                const points = secondRes.data.result.points;
                setUserPoints(points)
            } catch (err) {
                console.log("Error", err)
            }
        }
        points();

    }, [userPoints]);

    useEffect(() => {
        const products = async () => {
            try {
                setLoading(true)
                const res = await axios.get('http://localhost:8000/allProducts')
                const allProducts = res.data.result.map((data) => ({ id: data._id, image: data.productImage, productName: data.productName, cost: data.pointCost, quantity: data.quantity }));
                setProductList(allProducts);
                setLoading(false)
            } catch (err) {
                console.log("Error", err)
            }
        }
        products();
    }, []);


    // from chatGPT Prompt: mycode  it still updates all (my code): for setQuantities 02/02/2025

    // Prompt: The thing is setListOfProducts(prevListOfProducts => prevListOfProducts.filter(id=>id!==productId)),
    // It may have repeated products ids if a users buys the same thing more than once. so would this remove all of the same ids, or only one. 
    // ^^: for setListOfProducts 
    // prompt 2: would this not work to cap it as the max quantity (my code) 23/02/2025
    // prompt 3: why would this not work (code) 23/02/2025

    const add = (productId, cost, quantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) < quantity
                ? (prevQuantities[productId] || 0) + 1
                : prevQuantities[productId]
        }));
        setTotalAmount((prevTotalAmount) => {
            const currentQuantity = quantities[productId] || 0;
            return currentQuantity < quantity ? prevTotalAmount + cost : prevTotalAmount;
        })
        setListOfProducts((prevListOfProducts) => {
            const currentQuantity = quantities[productId] || 0;
            return currentQuantity < quantity ? [...prevListOfProducts, productId] : prevListOfProducts;
        })
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

    const onPlaceSelect = (place) => {
        if (place && place.properties && place.properties.formatted) {
            setAddress(place.properties.formatted);
        }
    }

    const updatedAddress = (value) => {
        setAddress(value);
    }

    const submit = async (e) => {

        e.preventDefault();

        if (address === "") {
            alert("Must enter a address")
        }
        else if (listOfProducts.length === 0) {
            alert("Must enter add something to purchase")
        }
        else if (userPoints < totalAmount) {
            alert(`You currently have ${userPoints} which is not enough to purchase all these items. Please remove some items`)
        }
        else {
            const data = {
                listOfProducts: listOfProducts,
                totalAmount: totalAmount,
                address: address
            }

            try {
                const res = await axios.post("http://localhost:8000/purchase", data)
                if (res.data.message === "Purchased") {
                    alert("The purchase has been made");
                    window.location.reload()

                }

            } catch (err) {
                console.log('error', err)
            }
        }

    }

    if (loading === true) {
        return <div id="loading"></div>;
    }

    return (
        <div id="allECommerceContent">
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
                            <button className="addOrSubtract" onClick={() => add(product.id, product.cost, product.quantity)}>+</button>
                        </div>

                    </div>
                )
                )}

            </div>

            <div id="totalCost">
                <p>Total cost: {totalAmount}</p>
            </div>

            <div id="autoCompleteAddressForPurchaseDiv">
                <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                    <GeoapifyGeocoderAutocomplete id="autoCompleteAddressForPurchase" placeholder="Enter address here"
                        lang='en'
                        limit={5}
                        value={address}
                        onChange={updatedAddress}
                        placeSelect={onPlaceSelect}
                    />
                </GeoapifyContext>
            </div>

            <div id="purchaseButtonDiv">
                <button id="submitPurchase" onClick={submit}>Submit</button>
            </div>
        </div>
    );
}

export default E_Commerce;