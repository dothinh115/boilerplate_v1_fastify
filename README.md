# Lưu ý:
1. Chỉ sử dụng với mongodb.
# Hướng dẫn sử dụng: 
## 1. Config
- Copy file .env-example vào file .env của bạn và chỉnh sửa lại theo cấu hình của bạn.
- Chỉnh sửa file settings.json
 ```javascript
 {
     "EXCLUDED_ROUTE": ["auth", "me", "route"], //điền vào các route không muốn tạo ra permissions, auth, me và route là mặc định
     "TEXT_SEARCH": ["title", "name"], //điền vào các route muốn tìm kiếm bằng tiếng Việt
     "TIMESTAMP": true,
     "VERSION_KEY": false,
     "AUTH": {
         "BROWSER_ID_CHECK": false // true nếu muốn check cả browserId, bắt buộc phải truyền thêm browserId khi login và refreshToken
     },
     "REFERENCE_CHECK": false //Chức năng đang thử nghiệm
 }
 ```
 Lúc này bạn đã chạy được dự án lên


## 2. Sử dụng
I. Có thể sử dụng các param như **fields**, **filter**, **sort**, **meta**, **limit**, **page** để lấy được kết quả như ý.
 ### Fields:
 1. 
  - Ký tự `*` để lấy tất cả các trường mong muốn.
  - Ký tự `-` để loại bỏ trường không mong muốn

 2. Điền các trường muốn lấy, cách nhau bởi dấu phẩy ',' ví dụ như `title,name,slug`
 3. Tham chiếu đến collection được liên kết:
    Ví dụ chúng ta có được kết quả từ api
    ```json
    {
     "_id": 1,
     "title": "abcd",
     "category": [
         12,
         17,
         35,
         3
     ],
     "author": 1,            
    },
    ```
    Muốn tham chiếu đến author chúng ta sẽ điền fields như sau
    ```text
    author.*
    ```
    Được kết quả
    ```json
    {
     "_id": 1,
     "title": "abcd",
     "category": [
         12,
         17,
         35,
         3
     ],
     "author": {
      "_id": 1,
      "name": "xyz",
      "createdAt": "2024-03-01T10:09:25.665Z",
      "updatedAt": "2024-03-01T10:09:25.665Z",
      },            
    }
    ```
    Tiếp tục chọn trường mong muốn bên trong author, thì đi vào trong 1 cấp nữa, cách nhau bởi dấu phẩy
    ```text
    author.name,author.createdAt
    ```
    Được kết quả
    ```json
    {
     "_id": 1,
     "title": "abcd",
     "category": [
         12,
         17,
         35,
         3
     ],
     "author": {
      "name": "xyz",
      "createdAt": "2024-03-01T10:09:25.665Z",
      },            
    }
    ```
 ### Filter: 
 Viết dưới dạng `filter[field][compareKey]=value`, với `compareKey` trùng với các quy tắc của mongo, ví dụ như `$eq` `$regex` `$gt`...

 ### Sort: 
 `sort=field` với field là trường được sort theo `asc` và `sort=-field` được sort theo `desc`.

 ### Meta: 
 `meta` được trả về với 2 field là `total_count` trả về số lượng document có trong collection, và `filter_count` trả về số lượng document thoả điều kiện của filter, hoặc đơn giản là dùng `meta=*` để lấy cả 2 kết quả này

 ### Limit và page: 
 Chức năng để phân trang
