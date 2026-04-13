<div class="hp-sidebar hp-bg-color-black-20 hp-bg-color-dark-90 border-end border-black-40 hp-border-color-dark-80">
    <div class="hp-sidebar-container">
        <div class="hp-sidebar-header-menu">
            <div class="row justify-content-between align-items-end mx-0">
                <div class="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-visible">
                    <div class="hp-cursor-pointer">
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                        </svg>
                    </div>
                </div>

                <div class="w-auto px-0">
                    <div class="hp-header-logo d-flex align-items-center">
                        <a href="{{ route('home') }}" class="position-relative">
                            <img class="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-none" src="{{ asset('storage/company/'.siteSettings()->logo) }}" alt="logo">
                        </a>
                    </div>
                </div>

                <div class="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden">
                    <div class="hp-cursor-pointer mb-4">
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <ul>
                {{-- Dashboard --}}
                <li>
                    <div class="menu-title">DASHBOARD</div>
                    <ul>
                        <li>
                            <a href="{{ route('admin.dashboard') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M8.97 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="m1.97 12.7 6-.02c.75 0 1.59.57 1.87 1.27l1.14 2.88c.26.65.67.65.93 0l2.29-5.81c.22-.56.63-.58.91-.05l1.04 1.97c.31.59 1.11 1.07 1.77 1.07h4.06" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                    <span>Dashboard</span>
                                </span>
                            </a>
                        </li>
                    </ul>
                </li>

                {{-- Orders --}}
                <li>
                    <div class="menu-title">ORDER</div>
                    <ul>
                        @if(auth('admin')->user()->canAny(['access-all','order-visibility']))
                        <li>
                            <a href="{{ route('admin.orders.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Orders"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M8.97 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M1.97 12.7 7.97 12.68C8.72 12.68 9.56 13.25 9.84 13.95L10.98 16.83C11.24 17.48 11.65 17.48 11.91 16.83L14.2 11.02C14.42 10.46 14.83 10.44 15.11 10.97L16.15 12.94C16.46 13.53 17.26 14.01 17.92 14.01H21.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                    <span>Orders</span>
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </li>
                
                {{-- Products Management --}}
                <li>
                    <div class="menu-title">PRODUCTS</div>
                    <ul>
                        {{-- Products List --}}
                        @if(auth('admin')->user()->canAny(['access-all','product-visibility']))
                        <li>
                            <a href="{{ route('admin.products.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Products"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.5 7.5L12 12L20.5 7.5M12 21V12M22 8.5V15.5C22 16.5 21.5 17.4 20.6 17.9L13.6 21.9C12.6 22.5 11.4 22.5 10.4 21.9L3.4 17.9C2.5 17.4 2 16.5 2 15.5V8.5C2 7.5 2.5 6.6 3.4 6.1L10.4 2.1C11.4 1.5 12.6 1.5 13.6 2.1L20.6 6.1C21.5 6.6 22 7.5 22 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>All Products</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- Categories (New) --}}
                        @if(auth('admin')->user()->canAny(['access-all','category-visibility']))
                        <li>
                            <a href="{{ route('admin.categories.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Categories"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Categories</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- Subcategories (New) --}}
                        @if(auth('admin')->user()->canAny(['access-all','subcategory-visibility']))
                        <li>
                            <a href="{{ route('admin.subcategories.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Subcategories"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 12V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Subcategories</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- Collections (Renamed from Product Categories) --}}
                        @if(auth('admin')->user()->canAny(['access-all','collection-visibility']))
                        <li>
                            <a href="{{ route('admin.collections.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Collections"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 16V8C21 7.5 20.7 7.1 20.4 6.8L16.7 3.2C16.4 2.9 16 2.7 15.5 2.7H8.5C8 2.7 7.6 2.9 7.3 3.2L3.6 6.8C3.3 7.1 3 7.5 3 8V16C3 16.5 3.3 16.9 3.6 17.2L7.3 20.8C7.6 21.1 8 21.3 8.5 21.3H15.5C16 21.3 16.4 21.1 16.7 20.8L20.4 17.2C20.7 16.9 21 16.5 21 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Collections</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- Attributes --}}
                        @if(auth('admin')->user()->canAny(['access-all','attribute-visibility']))
                        <li>
                            <a href="{{ route('admin.attributes.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Attributes"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M20.59 13.41L13.41 20.59C12.63 21.37 11.37 21.37 10.59 20.59L3.41 13.41C2.63 12.63 2.63 11.37 3.41 10.59L10.59 3.41C11.37 2.63 12.63 2.63 13.41 3.41L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7 9L9 7L17 15L15 17L7 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Attributes</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- Featured Products --}}
                        @if(auth('admin')->user()->canAny(['access-all','featured_product-visibility']))
                        <li>
                            <a href="{{ route('admin.featured_products.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Featured Products"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Featured Products</span>
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </li>
                
                {{-- Promotions & Marketing --}}
                <li>
                    <div class="menu-title">MARKETING</div>
                    <ul>
                        @if(auth('admin')->user()->canAny(['access-all','promotion-visibility']))
                        <li>
                            <a href="{{ route('admin.promotions.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Promotions"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Promotions</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        @if(auth('admin')->user()->canAny(['access-all','feature_card-visibility']))
                        <li>
                            <a href="{{ route('admin.feature-cards.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Feature Cards"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7 7H17V17H7V7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 7V17M7 12H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Feature Cards</span>
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </li>
                
                {{-- Settings --}}
                <li>
                    <div class="menu-title">SETTINGS</div>
                    <ul>
                        @if(auth('admin')->user()->canAny(['access-all','receive_category-visibility']))
                        <li>
                            <a href="{{ route('admin.receive_category.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Receive Categories"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 4H20V20H4V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M8 8H16V16H8V8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Receive Categories</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        {{-- @if(auth('admin')->user()->canAny(['access-all','site_settings-visibility']))
                        <li>
                            <a href="{{ route('admin.site-settings.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Site Settings"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M19.4 15.05L18.1 15.7C17.8 15.9 17.6 16.2 17.6 16.6V18C17.6 18.6 17.1 19 16.5 19H7.5C6.9 19 6.4 18.5 6.4 17.9V16.6C6.4 16.2 6.2 15.9 5.9 15.7L4.6 15.05C3.9 14.7 3.4 13.9 3.4 13.1V9.9C3.4 9.1 3.9 8.3 4.6 7.95L5.9 7.3C6.2 7.1 6.4 6.8 6.4 6.4V5C6.4 4.4 6.9 4 7.5 4H16.5C17.1 4 17.6 4.5 17.6 5.1V6.4C17.6 6.8 17.8 7.1 18.1 7.3L19.4 7.95C20.1 8.3 20.6 9.1 20.6 9.9V13.1C20.6 13.9 20.1 14.7 19.4 15.05Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Site Settings</span>
                                </span>
                            </a>
                        </li>
                        @endif --}}
                    </ul>
                </li>
                
                {{-- Staff & Role Management --}}
                <li>
                    <div class="menu-title">STAFF & PERMISSIONS</div>
                    <ul>
                        @if(auth('admin')->user()->canAny(['access-all','staff-visibility']))
                        <li>
                            <a href="{{ route('admin.staff.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Staff"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M5 20V19C5 15.1 8.1 12 12 12C15.9 12 19 15.1 19 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Staff Management</span>
                                </span>
                            </a>
                        </li>
                        @endif
                        
                        @if(auth('admin')->user()->canAny(['access-all','roles-visibility']))
                        <li>
                            <a href="{{ route('admin.roles.index') }}">
                                <div class="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="Roles & Permissions"></div>
                                <span>
                                    <span class="submenu-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 6V12M12 12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <span>Roles & Permissions</span>
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>