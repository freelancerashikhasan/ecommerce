import React from 'react';
import svg01 from "../assets/images/svg01.svg";
import svg02 from "../assets/images/svg02.svg";
import svg03 from "../assets/images/svg03.svg";
import svg04 from "../assets/images/svg04.svg";
import feature from "../assets/images/slider-01.png";
function CardSection() {
    return (
        <>
            <div className='cardSection'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 d-flex feature-card">
                            <div className="">
                                <img src={svg01} alt="" />
                            </div>
                            <div className="">
                                <h5>Payment only online</h5>
                                <p>
                                    Tasigförsamhet beteendedesign. Mobile
                                    checkout. Ylig kärrtorpa.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex feature-card">
                            <div className="">
                                <img src={svg02} alt="" />
                            </div>
                            <div className="">
                                <h5>New stocks and sales</h5>
                                <p>
                                    Tasigförsamhet beteendedesign. Mobile
                                    checkout. Ylig kärrtorpa.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex feature-card">
                            <div className="">
                                <img src={svg03} alt="" />
                            </div>
                            <div className="">
                                <h5>Quality assurance</h5>
                                <p>
                                    Tasigförsamhet beteendedesign. Mobile
                                    checkout. Ylig kärrtorpa.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex feature-card">
                            <div className="">
                                <img src={svg04} alt="" />
                            </div>
                            <div className="">
                                <h5>Delivery from 1 hour</h5>
                                <p>
                                    Tasigförsamhet beteendedesign. Mobile
                                    checkout. Ylig kärrtorpa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="feature-product-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="featureProduct"
                                style={{
                                    backgroundImage: `url(${feature})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '220px',
                                    width: '100%',
                                    borderRadius: '10px'
                                }}>
                                <p className='text01'>Only This Week</p>
                                <h5 className='title'>Quality eggs at an affordable price</h5>
                                <p className='text02'>Eat one every day</p>
                                <a className='shopBtn' href="">Shop Now <i className='fas fa-arrow-right'></i></a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="featureProduct"
                                style={{
                                    backgroundImage: `url(${feature})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '220px',
                                    width: '100%',
                                    borderRadius: '10px'
                                }}>
                                <p className='text01'>Only This Week</p>
                                <h5 className='title'>Quality eggs at an affordable price</h5>
                                <p className='text02'>Eat one every day</p>
                                <a className='shopBtn' href="">Shop Now <i className='fas fa-arrow-right'></i></a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="featureProduct"
                                style={{
                                    backgroundImage: `url(${feature})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '220px',
                                    width: '100%',
                                    borderRadius: '10px'
                                }}>
                                <p className='text01'>Only This Week</p>
                                <h5 className='title'>Quality eggs at an affordable price</h5>
                                <p className='text02'>Eat one every day</p>
                                <a className='shopBtn' href="">Shop Now <i className='fas fa-arrow-right'></i></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CardSection
