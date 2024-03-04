# Lưu ý:
1. Chỉ sử dụng với mongodb.
# Hướng dẫn sử dụng: 
## 1. Config
- Copy file .env-example vào file .env của bạn và chỉnh sửa lại theo cấu hình của bạn.
- Chỉnh sửa file settings.json
 
```javascript{
    "EXCLUDED_ROUTE": ["auth", "me", "route"], //điền vào các route không muốn tạo ra permissions, auth, me và route là mặc định
    "TEXT_SEARCH": ["title", "name"], //điền vào các route muốn tìm kiếm bằng tiếng Việt
    "TIMESTAMP": true,
    "VERSION_KEY": false,
    "AUTH": {
        "BROWSER_ID_CHECK": false // true nếu muốn check cả browserId, bắt buộc phải truyền thêm browserId khi login và refreshToken
    },
    "REFERENCE_CHECK": false //Chức năng đang thử nghiệm
}


