import React from 'react';


export default class ProductItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1
        }
    }

    handleInputChange = event => this.setState({[event.target.name]: event.target.value});

    addToCart = () => {
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
        let id = this.props.product.id.toString();
        cart[id] = (cart[id] ? cart[id] : 0);
        let quantity = cart[id] + parseInt(this.state.quantity);
        if (this.props.product.available_quantity < quantity) {
            cart[id] = this.props.product.available_quantity;
        } else {
            cart[id] = quantity
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    };


    render() {
        const {product} = this.props;

        return (
            <div className="card w-50" style={{marginBottom: "10px", width: "18rem" }}>

                <div className="card-body">
                    <img className="card-img-top" src={process.env.PUBLIC_URL + `images/${product.name}.jpg`} alt={product.name}/>


                    <h4 id="productName" className="card-title">{product.name}</h4>
                    <p className="card-text">{product.description}</p>
                    <h5 className="card-text">
                        <small>price:</small>
                        ${product.price}</h5>
                    <span className="card-text"><small>Available Quantity: </small>
                        {product.available_quantity}</span>

                    {product.available_quantity > 0 ?
                        <div>
                            <button className="btn btn-sm btn-warning float-right" onClick={this.addToCart}>Add to
                                cart
                            </button>
                            <input type="number" value={this.state.quantity} name="quantity"
                                   onChange={this.handleInputChange} className="float-right"
                                   style={{width: "60px", marginRight: "10px", borderRadius: "3px"}}/>
                        </div> :
                        <p className="text-danger">out of stock </p>
                    }

                </div>
                <div className="card">
                    <div className="card-body">
                        Thanks for shopping, we will be happy to see you soon!
                    </div>
                </div>
            </div>
        )
    }
}
