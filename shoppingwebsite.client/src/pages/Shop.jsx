import { useState, useEffect, useRef } from 'react';
import apiFetch from '../services/api'
import './Shop.css';

function Shop({ cartItems, setCartItems, token }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        async function populateShopItems() {
            try {
                const params = new URLSearchParams();
                if (nameFilter) params.append('name', nameFilter);
                if (categoryFilter.length > 0) params.append('categories', categoryFilter.join(','));
                if (priceFilter) params.append('maxPrice', priceFilter);
                if (stockFilter) params.append('minStock', stockFilter);
                params.append('pageIndex', pageIndex);
                const response = await apiFetch(`api/shop?${params.toString()}`, token);

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                setCategoriesFilter(data.categoriesFilter || []);
                setItems(data.items);
                setPageCount(data.pageCount);
            }
            catch (err) {
                console.error('Failed to fetch shop items: ' + err);
            }
            finally {
                setLoading(false);
            }

        }

        populateShopItems();

    }, [nameFilter, categoryFilter, priceFilter, stockFilter, pageIndex]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowCategoryDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);


    if (loading) return <div>Loading items...</div>;

    function addItemToCart(id, setCartItems) {
        setCartItems((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    function toggleCategorySelection(categoryId) {
        setCategoryFilter((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    }

    return (
        <div className="shop-wrap">
            <div className="shop-content">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filter by name"
                        value={nameFilter}
                        onChange={(e) => {
                            setNameFilter(e.target.value);
                            setPageIndex(0);
                        }}
                    />
                    <label>
                        Show Categories:
                    </label>

                    <span className="dropdown-wrap">
                        <button
                            ref={buttonRef}
                            onClick={() => setShowCategoryDropdown((prev) => !prev)}
                        >
                            {categoryFilter.length === 0 ? 'All' : `${categoryFilter.length} Selected`}
                        </button>

                        {showCategoryDropdown && (
                            <div
                                ref={dropdownRef}
                                className="dropdown-content"
                            >
                                {categoriesFilter.map((category) => (
                                    <div key={category.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={categoryFilter.includes(String(category.id))}
                                                onChange={() => {
                                                    toggleCategorySelection(String(category.id));
                                                    setPageIndex(0);
                                                }}
                                            />
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </span>

                    <input
                        type="number"
                        placeholder="Max price"
                        value={priceFilter}
                        onChange={(e) => {
                            setPriceFilter(e.target.value);
                            setPageIndex(0);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Min stock"
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setPageIndex(0);
                        }}
                    />
                </div>
                <div className="filters">
                    <button onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={pageIndex === 0}
                    >
                        Previous
                    </button>
                    <span>{pageIndex + 1} / {pageCount}</span>
                    <button
                        onClick={() => setPageIndex((prev) => prev + 1)}
                        disabled={pageIndex + 1 >= pageCount}
                    >
                        Next
                    </button>
                </div>
                <ul className="item-list">
                    {items.map((item) => {

                        const remainingStock = item.stock - (cartItems[item.id] || 0);
                        const outOfStock = remainingStock < 1;

                        return (
                            <li key={item.id}>
                                <img
                                    src={`/src/assets/items/${item.id}.png`}
                                    onError={(e) => e.target.src = '/src/assets/items/placeholder.jpg'}
                                >
                                </img>
                                <div className="item-details">
                                    {item.name} - ${item.price.toFixed(2)}.
                                    <div>{outOfStock ? <span className="out-of-stock">Out of Stock</span> : `${remainingStock} Left`}</div>

                                </div>
                                <button disabled={(item.stock - (cartItems[item.id] || 0)) > 0 ? false : true}
                                    onClick={() => addItemToCart(item.id, setCartItems)}>
                                    Add to cart
                                </button>
                            </li>
                        )
                    })}

                </ul>
            </div>
        </div>
    );

}

export default Shop;