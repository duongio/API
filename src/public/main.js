function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        fetch('http://localhost:3000/api/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        })
            .then(response => {
                if (!response.ok) {
                    alert('Token đã hết hạn. Cần đăng nhập lại.')
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user_id');
                    window.location.href = "/api/login";
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                location.reload();
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi trong quá trình làm mới token.');
    }
}

const token = localStorage.getItem('token');
const logButton = document.getElementById('log');
const contentMain = document.getElementById('content_main');

if (!token) {
    logButton.style.display = 'inline';
    contentMain.style.display = 'none';
    logButton.innerHTML = 'Login';
} else {
    fetch('http://localhost:3000/api/token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.status)
        .then(data => {
            if (data === 401) {
                alert('Token không hợp lệ. Lấy lại token.')
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                logButton.style.display = 'none';
                contentMain.style.display = 'inline';
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Error.");
        });
}

logButton.onclick = () => {
    window.location.href = "/api/login";
}

//===================================== Content Main =====================================
const getCategoriesTree = document.getElementById('get_categories_tree');
getCategoriesTree.onclick = () => {
    fetch(`http://localhost:3000/api/categories/tree?token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/categories/tree?token=${token}`, '_blank');
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

const getProductSearch = document.getElementById('get_product_list');
getProductSearch.onclick = () => {
    const search = document.querySelector('input[name="search"]').value;
    const orderBy = document.getElementById("order_by").value;
    fetch(`http://localhost:3000/api/products/search?search=${search}&orderBy=${orderBy}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/search?search=${search}&orderBy=${orderBy}&token=${token}`, '_blank');
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

const getProductDetail = document.getElementById('get_product_detail');
getProductDetail.onclick = () => {
    const id = document.querySelector('input[name="id_product_detail"]').value;
    fetch(`http://localhost:3000/api/products/${id}/details?&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/${id}/details?&token=${token}`, '_blank');
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

const getProductRecommendation = document.getElementById('get_product_recommendations');
getProductRecommendation.onclick = () => {
    const id = document.querySelector('input[name="id_product_detail"]').value;
    const user_id = localStorage.getItem('user_id');
    fetch(`http://localhost:3000/api/products/${id}/recommendations?userId=${user_id}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/${id}/recommendations?userId=${user_id}&token=${token}`, '_blank');
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

const getRating = document.getElementById('get_rating_product');
getRating.onclick = () => {
    const id = document.querySelector('input[name="id"]').value;
    fetch(`http://localhost:3000/api/products/${id}/reviews?token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.')
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/${id}/reviews?token=${token}`, '_blank');
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

const getInformationSeller = document.getElementById('get_info_seller');
getInformationSeller.onclick = () => {
    const seller_id = document.querySelector('input[name="seller_id"]').value;
    fetch(`http://localhost:3000/api/seller/${seller_id}?token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/seller/${seller_id}?token=${token}`, '_blank');
            }
        })
}

const getHistoryUser = document.getElementById('get_history_user');
getHistoryUser.onclick = () => {
    const user_id = document.querySelector('input[name="user_id"]').value;
    fetch(`http://localhost:3000/api/users/${user_id}/orders/history?token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/users/${user_id}/orders/history?token=${token}`, '_blank');
            }
        })
}

const getTopProducts = document.getElementById('get_top_products');
getTopProducts.onclick = () => {
    const category_id = document.querySelector('input[name="category_id"]').value;
    fetch(`http://localhost:3000/api/categories/${category_id}/top-products?token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/categories/${category_id}/top-products?token=${token}`, '_blank');
            }
        })
}

const getTopSelling = document.getElementById('get_top_selling');
getTopSelling.onclick = () => {
    const category_id = document.querySelector('input[name="category_id_selling"]').value;
    const start_date = document.querySelector('input[name="start_date"]').value;
    const end_date = document.querySelector('input[name="end_date"]').value;
    fetch(`http://localhost:3000/api/products/top-selling?category_id=${category_id}&start_date=${start_date}&end_date=${end_date}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/top-selling?category_id=${category_id}&start_date=${start_date}&end_date=${end_date}&token=${token}`, '_blank');
            }
        })
}

const getTopRated = document.getElementById('get_top_rated');
getTopRated.onclick = () => {
    const category_id = document.querySelector('input[name="category_id_rated"]').value;
    const min_review_count = document.querySelector('input[name="min_review_count"]').value;
    fetch(`http://localhost:3000/api/products/top-rated?category_id=${category_id}&min_review_count=${min_review_count}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/products/top-rated?category_id=${category_id}&min_review_count=${min_review_count}&token=${token}`, '_blank');
            }
        })
}

const getBrandsTopBySales = document.getElementById('get_brands_top_by_sales');
getBrandsTopBySales.onclick = () => {
    const category_id = document.querySelector('input[name="category_id_brands"]').value;
    const start_date = document.querySelector('input[name="start_date_brand"]').value;
    const end_date = document.querySelector('input[name="end_date_brand"]').value;
    fetch(`http://localhost:3000/api/brands/top-by-sales?category_id=${category_id}&start_date=${start_date}&end_date=${end_date}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/brands/top-by-sales?category_id=${category_id}&start_date=${start_date}&end_date=${end_date}&token=${token}`, '_blank');
            }
        })
}

const getTopStores = document.getElementById('get_stores_top_rated');
getTopStores.onclick = () => {
    const min_follower_count = document.querySelector('input[name="min_follower_count"]').value;
    fetch(`http://localhost:3000/api/stores/top-rated?min_follower_count=${min_follower_count}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/stores/top-rated?min_follower_count=${min_follower_count}&token=${token}`, '_blank');
            }
        })
}

const getRetentionRateSeller = document.getElementById('get_seller_retention_rate');
getRetentionRateSeller.onclick = () => {
    const seller_id = document.querySelector('input[name="seller_id_retention_rate"]').value;
    const time_range = document.querySelector('input[name="time_range"]').value;
    fetch(`http://localhost:3000/api/stores/${seller_id}/retention-rate?time_range=${time_range}&token=${token}`)
        .then(response => {
            if (response.status === 401) {
                alert('Token không hợp lệ. Lấy lại token.');
                localStorage.removeItem('token');
                refreshAccessToken();
            } else {
                window.open(`http://localhost:3000/api/stores/${seller_id}/retention-rate?time_range=${time_range}&token=${token}`, '_blank');
            }
        })
}