@extends('layouts.admin.app')

@section('content')

    <div class="row mb-32 gy-32">
        <div class="col-12">
            <div class="row align-items-center justify-content-between g-24">
                <div class="col-12 col-md-6">
                    <h3>Welcome back, Edward 👋</h3>
                    <p class="hp-p1-body mb-0">Your current status and analytics are here</p>
                </div>

                <div class="col hp-flex-none w-auto">
                    <select class="form-select">
                        <option selected value="1">This Month</option>
                        <option value="2">This Week</option>
                        <option value="3">This Year</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="col-12">
            <div class="row g-32 mb-32">
                <div class="col-12 col-md-6 col-xl-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row g-16">
                                <div class="col-6 hp-flex-none w-auto">
                                    <div class="avatar-item d-flex align-items-center justify-content-center avatar-lg bg-primary-4 hp-bg-color-dark-primary rounded-circle">
                                        <i class="iconly-Light-People text-primary hp-text-color-dark-primary-2" style="font-size: 24px;"></i>
                                    </div>
                                </div>

                                <div class="col">
                                    <h3 class="mb-4 mt-8">243<span class="hp-badge-text ms-8 text-primary hp-text-color-dark-primary-2">+3%</span></h3>
                                    <p class="hp-p1-body mb-0 text-black-80 hp-text-color-dark-30">New Customer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-xl-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row g-16">
                                <div class="col-6 hp-flex-none w-auto">
                                    <div class="avatar-item d-flex align-items-center justify-content-center avatar-lg bg-secondary-4 hp-bg-color-dark-secondary rounded-circle">
                                        <i class="iconly-Light-Buy text-secondary" style="font-size: 24px;"></i>
                                    </div>
                                </div>

                                <div class="col">
                                    <h3 class="mb-4 mt-8">1,243<span class="hp-badge-text ms-8 text-secondary">+4%</span></h3>
                                    <p class="hp-p1-body mb-0 text-black-80 hp-text-color-dark-30">New Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-xl-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row g-16">
                                <div class="col-6 hp-flex-none w-auto">
                                    <div class="avatar-item d-flex align-items-center justify-content-center avatar-lg bg-warning-4 hp-bg-color-dark-warning rounded-circle">
                                        <i class="iconly-Light-Ticket text-warning" style="font-size: 24px;"></i>
                                    </div>
                                </div>

                                <div class="col">
                                    <h3 class="mb-4 mt-8">$ 323<span class="hp-badge-text ms-8 text-warning">-1.4%</span></h3>
                                    <p class="hp-p1-body mb-0 text-black-80 hp-text-color-dark-30">Average Sale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-xl-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row g-16">
                                <div class="col-6 hp-flex-none w-auto">
                                    <div class="avatar-item d-flex align-items-center justify-content-center avatar-lg bg-danger-4 hp-bg-color-dark-danger rounded-circle">
                                        <i class="iconly-Light-Discount text-danger" style="font-size: 24px;"></i>
                                    </div>
                                </div>

                                <div class="col">
                                    <h3 class="mb-4 mt-8">$ 1,32<span class="hp-badge-text ms-8 text-danger">+3%</span></h3>
                                    <p class="hp-p1-body mb-0 text-black-80 hp-text-color-dark-30">Gross Profit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-32">
                <div class="col-12 col-xl-8">
                    <div class="row g-32">
                        <div class="col-12">
                            <div class="card hp-card-6 hp-chart-text-color">
                                <div class="card-body">
                                    <div class="row justify-content-between mb-16">
                                        <div class="col-6">
                                            <h4 class="me-8">Revenue</h4>
                                        </div>
                                    </div>

                                    <div id="analytics-revenue-chart"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="card hp-project-ecommerce-table-card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-between mb-32">
                                                <h5 class="mb-0">Latest Orders</h5>
                                                <p class="hp-p1-body mb-0 fw-medium text-black-100 hp-text-color-dark-0">View all orders</p>
                                            </div>

                                            <div class="table-responsive">
                                                <table class="table align-middle mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th style="min-width: 110px;">
                                                                <span class="hp-badge-size d-block pb-16 fw-normal text-black-60 hp-text-color-dark-50 text-uppercase">Date</span>
                                                            </th>
                                                            <th style="min-width: 180px;">
                                                                <span class="hp-badge-size d-block pb-16 fw-normal text-black-60 hp-text-color-dark-50 text-uppercase">Billing Name</span>
                                                            </th>
                                                            <th>
                                                                <span class="hp-badge-size d-block pb-16 fw-normal text-black-60 hp-text-color-dark-50 text-uppercase">Amount</span>
                                                            </th>
                                                            <th>
                                                                <span class="hp-badge-size d-block pb-16 fw-normal text-black-60 hp-text-color-dark-50 text-uppercase">Status</span>
                                                            </th>
                                                            <th class="text-center">
                                                                <span class="hp-badge-size d-block pb-16 fw-normal text-black-60 hp-text-color-dark-50 text-uppercase">Invoice</span>
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr>
                                                            <td class="ps-0">
                                                                <span class="mb-0 fw-medium text-black-100 hp-text-color-dark-0">June 9, 2020</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">Elon Musk</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">$1,322.45</span>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-success-4 hp-bg-dark-success text-success border-success">Paid</span>
                                                            </td>
                                                            <td>
                                                                <span class="d-block text-black-60 hp-text-color-dark-50 text-center">
                                                                    <i class="iconly-Light-Download"></i>
                                                                </span>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="ps-0">
                                                                <span class="mb-0 fw-medium text-black-100 hp-text-color-dark-0">June 9, 2020</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">Christiano Ronaldo</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">$733.32</span>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-success-4 hp-bg-dark-success text-success border-success">Paid</span>
                                                            </td>
                                                            <td>
                                                                <span class="d-block text-black-60 hp-text-color-dark-50 text-center">
                                                                    <i class="iconly-Light-Download"></i>
                                                                </span>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="ps-0">
                                                                <span class="mb-0 fw-medium text-black-100 hp-text-color-dark-0">June 10, 2020</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">Jeff Bezos</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">$1,923.32</span>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-warning-4 hp-bg-dark-warning text-warning border-warning">Refund</span>
                                                            </td>
                                                            <td>
                                                                <span class="d-block text-black-60 hp-text-color-dark-50 text-center">
                                                                    <i class="iconly-Light-Download"></i>
                                                                </span>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="ps-0">
                                                                <span class="mb-0 fw-medium text-black-100 hp-text-color-dark-0">June 9, 2020</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">Richard Hamilton</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">$922.12</span>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-success-4 hp-bg-dark-success text-success border-success">Paid</span>
                                                            </td>
                                                            <td>
                                                                <span class="d-block text-black-60 hp-text-color-dark-50 text-center">
                                                                    <i class="iconly-Light-Download"></i>
                                                                </span>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td class="ps-0">
                                                                <span class="mb-0 fw-medium text-black-100 hp-text-color-dark-0">June 10, 2020</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">Lebron James</span>
                                                            </td>
                                                            <td>
                                                                <span class="mb-0 text-black-80 hp-text-color-dark-30">$323.98</span>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-danger-4 hp-bg-dark-danger text-danger border-danger">Charge Back</span>
                                                            </td>
                                                            <td>
                                                                <span class="d-block text-black-60 hp-text-color-dark-50 text-center">
                                                                    <i class="iconly-Light-Download"></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="row g-32">
                                <div class="col-12 col-md-6">
                                    <div class="card hp-card-6">
                                        <div class="card-body pb-0">
                                            <div class="d-flex align-items-center justify-content-between mb-16">
                                                <h5 class="mb-0">Revenue</h5>
                                                <p class="hp-badge-text text-black-80 hp-text-color-dark-30 mb-0">May 2021</p>
                                            </div>

                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row align-items-center">
                                                        <div class="col-6">
                                                            <div id="statistics-revenue-1"></div>
                                                        </div>

                                                        <div class="col hp-flex-none w-auto">
                                                            <p class="hp-text-color-dark-0 mb-0">Total Sales</p>

                                                            <div class="d-flex align-items-center">
                                                                <h5 class="mb-0 me-4">$ 12,253</h5>

                                                                <i class="ri-arrow-right-down-line lh-1 text-danger" style="font-size: 12px;"></i>

                                                                <p class="mb-0 hp-input-description text-danger">
                                                                    10%
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-12">
                                                    <div class="row align-items-center">
                                                        <div class="col-6">
                                                            <div id="statistics-revenue-2"></div>
                                                        </div>

                                                        <div class="col hp-flex-none w-auto">
                                                            <p class="hp-text-color-dark-0 mb-0">Total Expense</p>

                                                            <div class="d-flex align-items-center">
                                                                <h5 class="mb-0 me-4">$4,253</h5>

                                                                <i class="ri-arrow-right-up-line lh-1 text-primary" style="font-size: 12px;"></i>

                                                                <p class="mb-0 hp-input-description text-primary">
                                                                    10%
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-12">
                                                    <div class="row align-items-center">
                                                        <div class="col-6">
                                                            <div id="statistics-revenue-3"></div>
                                                        </div>

                                                        <div class="col hp-flex-none w-auto">
                                                            <p class="hp-text-color-dark-0 mb-0">Total Profit</p>

                                                            <div class="d-flex align-items-center">
                                                                <h5 class="mb-0 me-4">$4,253</h5>

                                                                <i class="ri-subtract-fill lh-1 text-warning" style="font-size: 12px;"></i>

                                                                <p class="mb-0 hp-input-description text-warning">
                                                                    10%
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6">
                                    <div class="card hp-card-6 hp-eCommerceCardOne">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row align-items-start justify-content-between">
                                                        <div class="col">
                                                            <h5 class="mb-0">Browser states</h5>
                                                        </div>

                                                        <div class="col hp-flex-none w-auto">
                                                            <p class="hp-badge-text text-black-80 hp-text-color-dark-30 mb-0">May 2021</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-12">
                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/chrome.svg" alt="Google Chrome">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Google Chrome</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">50.2%</p>
                                                                <div id="browser-chrome-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/firefox.svg" alt="Mozila Firefox">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Mozila Firefox</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">12.5%</p>
                                                                <div id="browser-firefox-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/safari.svg" alt="Apple Safari">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Apple Safari</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">24.8%</p>
                                                                <div id="browser-safari-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/edge.svg" alt="Microsoft Edge">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Microsoft Edge</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">4.7%</p>
                                                                <div id="browser-edge-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/opera.svg" alt="Opera">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Opera</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">7.8%</p>
                                                                <div id="browser-opera-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row align-items-center justify-content-between mt-32">
                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-8">
                                                                    <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/browser/other.svg" alt="Other">
                                                                </div>

                                                                <p class="hp-p1-body mb-0">Other</p>
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <div class="d-flex align-items-center justify-content-end position-relative">
                                                                <p class="hp-badge-text mb-0 me-8">2.2%</p>
                                                                <div id="browser-other-chart"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl-4">
                    <div class="row g-32">
                        <div class="col-12">
                            <div class="card hp-card-6">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-12">
                                            <h5 class="mb-32">Earnings</h5>
                                        </div>

                                        <div class="col-12">
                                            <div id="earnings-donut-card" class="hp-donut-chart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-xl-12">
                            <div class="card hp-card-6">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-12 text-center">
                                            <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/illustrations/growth.svg" alt="Upgrade Account" class="hp-dark-none">
                                            <img src="https://yoda.hypeople.studio/yoda-admin-template/app-assets/img/illustrations/growth-dark.svg" alt="Upgrade Account" class="hp-dark-block mx-auto">

                                            <h3 class="mt-24 mb-16 me-4">Upgrade Account</h3>
                                            <p class="hp-p1-body mb-0">5 integrations, 30 team members, <br> advanced<span class="mx-4 text-primary hp-text-color-dark-primary-2 fw-medium">features</span>for teams.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-xl-12">
                            <div class="card hp-ecommerce-detail-card hp-card-6 overflow-hidden">
                                <div class="position-absolute top-0 start-0 w-100 h-100 hp-dark-none" style="background-image: url(../../../app-assets/img/dashboard/ecommerce-card-bg.png); background-size: cover; background-position: center center;"></div>
                                <div class="position-absolute top-0 start-0 w-100 h-100 hp-dark-block" style="background-image: url(../../../app-assets/img/dashboard/ecommerce-card-bg-dark.png); background-size: cover; background-position: center center;"></div>

                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-7 position-relative">
                                            <h2 class="mb-0">New VR-07</h2>
                                            <span class="hp-p1-body d-block text-black-60 hp-text-color-dark-50">By Google</span>
                                            <button type="button" class="btn btn-primary btn-ghost mt-16">
                                                <span>Check Detail</span>
                                            </button>
                                        </div>

                                        <img src="../../../app-assets/img/dashboard/ecommerce-card-img.png" alt="New VR-07">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 best-selling-product-slide overflow-hidden">
            <div class="row align-items-center justify-content-between mb-16">
                <div class="col-6">
                    <h4 class="mb-0">Best Selling Products</h4>
                </div>

                <div class="col hp-flex-none w-auto">
                    <div class="d-flex">
                        <button class="slide-btn-prev btn btn-icon-only">
                            <i class="ri-arrow-left-s-line remix-icon mb-0" style="font-size: 24px;"></i>
                        </button>

                        <button class="slide-btn-next btn btn-icon-only ms-8">
                            <i class="ri-arrow-right-s-line remix-icon mb-0" style="font-size: 24px;"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="hp-card-6 hp-eCommerceCardOne">
                            <div class="rounded overflow-hidden border border-black-40 hp-border-color-dark-80 bg-black-0 hp-bg-color-dark-100 h-100">
                                <div class="text-center bg-black-10 hp-bg-color-dark-80 hp-card-2 d-flex align-items-center justify-content-center">
                                    <img src="../../../app-assets/img/product/ecommerce-product-img-1.png" alt="Rales Wireless Earbuds Bluetooth 5.0">
                                </div>

                                <div class="p-24">
                                    <div class="mb-16 mt-8">
                                        <h3 class="mb-4">$69.00</h3>
                                        <p class="mb-0 me-4 fw-medium text-black-60 hp-text-color-dark-50 text-decoration-line-through hp-badge">$79.00</p>
                                    </div>

                                    <div class="mb-8">
                                        <p class="mb-4 text-black-100 hp-text-color-dark-0 hp-p1-body">Rales Wireless Earbuds Bluetooth 5.0</p>
                                        <p class="mb-0 hp-caption text-black-60 hp-text-color-dark-50">By Urbanears</p>
                                    </div>

                                    <div class="mt-16">
                                        <ul class="row g-6">
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-black-40 hp-text-color-dark-70" style="font-size: 20px;"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="hp-card-6 hp-eCommerceCardOne">
                            <div class="rounded overflow-hidden border border-black-40 hp-border-color-dark-80 bg-black-0 hp-bg-color-dark-100 h-100">
                                <div class="text-center bg-black-10 hp-bg-color-dark-80 hp-card-2 d-flex align-items-center justify-content-center">
                                    <img src="../../../app-assets/img/product/ecommerce-product-img-2.png" alt="Rales Wireless Earbuds Bluetooth 5.0">
                                </div>

                                <div class="p-24">
                                    <div class="mb-16 mt-8">
                                        <h3 class="mb-4">$69.00</h3>
                                        <p class="mb-0 me-4 fw-medium text-black-60 hp-text-color-dark-50 text-decoration-line-through hp-badge">$79.00</p>
                                    </div>

                                    <div class="mb-8">
                                        <p class="mb-4 text-black-100 hp-text-color-dark-0 hp-p1-body">Rales Wireless Earbuds Bluetooth 5.0</p>
                                        <p class="mb-0 hp-caption text-black-60 hp-text-color-dark-50">By Urbanears</p>
                                    </div>

                                    <div class="mt-16">
                                        <ul class="row g-6">
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-black-40 hp-text-color-dark-70" style="font-size: 20px;"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="hp-card-6 hp-eCommerceCardOne">
                            <div class="rounded overflow-hidden border border-black-40 hp-border-color-dark-80 bg-black-0 hp-bg-color-dark-100 h-100">
                                <div class="text-center bg-black-10 hp-bg-color-dark-80 hp-card-2 d-flex align-items-center justify-content-center">
                                    <img src="../../../app-assets/img/product/ecommerce-product-img-1.png" alt="Rales Wireless Earbuds Bluetooth 5.0">
                                </div>

                                <div class="p-24">
                                    <div class="mb-16 mt-8">
                                        <h3 class="mb-4">$69.00</h3>
                                        <p class="mb-0 me-4 fw-medium text-black-60 hp-text-color-dark-50 text-decoration-line-through hp-badge">$79.00</p>
                                    </div>

                                    <div class="mb-8">
                                        <p class="mb-4 text-black-100 hp-text-color-dark-0 hp-p1-body">Rales Wireless Earbuds Bluetooth 5.0</p>
                                        <p class="mb-0 hp-caption text-black-60 hp-text-color-dark-50">By Urbanears</p>
                                    </div>

                                    <div class="mt-16">
                                        <ul class="row g-6">
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-black-40 hp-text-color-dark-70" style="font-size: 20px;"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="hp-card-6 hp-eCommerceCardOne">
                            <div class="rounded overflow-hidden border border-black-40 hp-border-color-dark-80 bg-black-0 hp-bg-color-dark-100 h-100">
                                <div class="text-center bg-black-10 hp-bg-color-dark-80 hp-card-2 d-flex align-items-center justify-content-center">
                                    <img src="../../../app-assets/img/product/ecommerce-product-img-2.png" alt="Rales Wireless Earbuds Bluetooth 5.0">
                                </div>

                                <div class="p-24">
                                    <div class="mb-16 mt-8">
                                        <h3 class="mb-4">$69.00</h3>
                                        <p class="mb-0 me-4 fw-medium text-black-60 hp-text-color-dark-50 text-decoration-line-through hp-badge">$79.00</p>
                                    </div>

                                    <div class="mb-8">
                                        <p class="mb-4 text-black-100 hp-text-color-dark-0 hp-p1-body">Rales Wireless Earbuds Bluetooth 5.0</p>
                                        <p class="mb-0 hp-caption text-black-60 hp-text-color-dark-50">By Urbanears</p>
                                    </div>

                                    <div class="mt-16">
                                        <ul class="row g-6">
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-warning" style="font-size: 20px;"></i>
                                            </li>
                                            <li class="col hp-flex-none w-auto">
                                                <i class="ri-star-fill text-black-40 hp-text-color-dark-70" style="font-size: 20px;"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection