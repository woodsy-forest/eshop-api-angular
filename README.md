# eshop-api-angular #
This app in Angular 11 is only a demo to show how to call the eShop API. 

Online demo: http://luca888-001-site17.htempurl.com
Admin Credentials:
email: admin@yourstore.com
password: admin

eShop API provides a backend support to manage an online shop. Any Theme, Framework or Tool such as: Angular, React, .net Core or Postman can call them the manage an eshop.

This demo uses the following features/components: 

* Angular Universal --> SEO Friendly
* Lazy Loading --> Faster Page Loading
* Angular Flex-Layout --> Responsive Design
* Angular Material -> Drag&Drop and Modal Popup Windows
* Interseptor --> Centralised way to manage Outgoing Requests 
* Services --> Reusable Components
* JSON Web Tokens (JWT) --> Secure Transmission
* ngx-PayPal --> PayPal Smart Payment Buttons

## Installation ##

1. donwload the zip file
2. unzip it in a local folder
3. in the environment variable set the url to call the eshop api.
    ```yaml
    export const environment = {
      production: false,
      baseHref: '/',
      debug_mode: true,
      eshop_api_url: 'http://localhost:5000',
      paypal_clientId: 'whatever....'
      paypal_currency: 'USD'
    };
    ```
[Set the paypal variables in case you want to use the PayPal Smart Payment Buttons].

4. open a command prompt window
5. go to the local folder and run: npm install
6. then run: npm run dev:ssr
7. open a web browser and navigate to: http://localhost:4000


# eShop Api Documentation #
These Api are written in c#, .net core 5.0, Entity Framework 5.0, SQL Server 2019.

## Installation ##
To install the Api, unzip the file, copy and paste the files in the root of your web folder.
Change the appsettings.json file as required:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "ConnectionStrings": {
    "eShopContext": "Server=ServerName;Database=DatabaseName;User Id=UserName;Password=Password;"
  },
  "AllowedOrigins": "http://localhost:4200",
  "Jwt": {
    "Key": "sd2WxWE$df4g64rs4htUJ&54£5fegj54&hGyT",
    "ExpirySeconds": 7200,
    "Issuer": "http://localhost:5000",
    "Audience": "http://localhost:5000/api"
  },
  "Recaptcha": {
    "SecretKey": "ABfRTWWDFF568GrtYDF567iKL"
  },
  "Smtp": {
    "smtpClient": "smtpServerName",
    "credentialEmail": "admin@mystore.com",
    "credentialPassword": "myPassword",
    "emailFrom": "info@mystore.com"
  },
  "CultureInfo": "en-US",
   "PayPalSmartPaymentButtons": {
    "Url": "https://api-m.sandbox.paypal.com",
    "ClientId": "myClientId",
    "Secret": "myClientSecret"
  }
}
```
ConnectionStrings is the connection string to your database.

AllowedOrigins is the url for CORS.

Jwt contains the settings for the Json Web Token. Key is the secret key to encrypt the token. Set ExpirySeconds at least 2 hours otherwise when there is the Daylight Saving Time the generated token has already been expired.

Recaptcha contains the secret key obtained from https://www.google.com/recaptcha
in Admin Console after having done the login and registered your domain. This is used to validate API request during the customer registration, see Account API.

Smtp contains the settings for sending emails.

CultureInfo is the culture set up for the App. It determines, for example, the appropriate currency simbol in the confirmation order email.

PayPalSmartPaymentButtons are the credentials to use PayPal Smart Payment Buttons. For more info about it, see this: https://developer.paypal.com/docs/api/overview

After you have modified the appsettings.json file, start the application, this will create the database.

To login as an Administrator, use these credentials.

Admin Login:
email: admin@yourstore.com
password: admin

## Account API ##

### Register ###

**Method:** POST

**Url:** /api/account/register

**Header(s):** 	key: Content-Type 		value: application/json

**Body:**
```json
{
  "FirstName": "Woodsy",
  "LastName": "Forest",
  "Email": "admin@mystore.com",
  "Password":"admin",
  "ReCaptchaResponse": ""
}
```

Email and Password are compulsory. The Api sends a confirmation email and it returns 200–OK if the registration has been successful. The confirmation email template is in the Setting Name (see Setting Api): *confirmationEmail.bodyHtml*. In this template the placeHolder [##ConfirmationLink##] is replaced with the actual confirmation page link plus the CustomerId to confirm. In the UI you need to create this confirmation page which reads the CustomerId from the url and it calls the Confirm Api to confirm the customer. The Register Api, also, creates a record with isActive equal to false in the customer table with Registered Role.

To validate the registration the API uses [Recaptcha](https://www.google.com/recaptcha). In the Admin Console, after the login you need to register your store's domain as v2 Checkbox type. To test it locally add as domain: localhost. In the reCAPTCHA keys section, copy site key in your UI app and copy secret key in the appsettings.json file ("Recaptcha:SecretKey" variable) of the eShop-Api app. 

If you do not want to use Recaptcha, disable it using the Setting API (set confirmationEmail.verifyRequest.reCAPTCHA.v2 equal to false).

### Email Confirmation ###

**Method:** POST

**Url:** /api/account/email-confirmation/{guid}

**Header(s):** 	key: Content-Type 		value: application/json

**Body:**  *empty*

{guid} is the CustomerGuid sent by the Register API in the confirmation email. If Guid is found in the Customer table, it sets the IsValid field equal to true and it returns the updated CustomerDTO, otherwise it returns 404 - Not found error. In this demo the email confirmation page is in /account/email-confirmation-page/{id}. To test it, replace {id} with the CustomerId sent in the Email Confirmation.

### Login ###

**Method:** GET

**Url:** /api/account/login?email=admin@yourstore.com&password=admin&rememberMe=true

When rememberMe is equal to true then the token expires after one year.

**Admin Login Credentials:**

*email:* admin@yourstore.com

*password:* admin

The Api returns the token to use to make future requests.
The generated token is a [Json Web Token](https://jwt.io/). The claims iat (Issued At) and exp (Expiration time) are in seconds since Unix Epoch, that it the number of seconds from 1970-01-01T00:00:00Z UTC until the specified UTC date/time. So, (exp - iat) is the lifetime of the token in seconds. That number can be converted to Javascript DateTime like this: new Date(exp_in_seconds * 1000) (where Javascript requires miliseconds since Unix Epoch).  

### Reset Password (Admin only) ###

**Method:** PUT

**Url:** /api/account/reset-password/{id}

**Header(s):** key: Authorization  		value: {token}

{id} is the CustomerId to reset.

The Api returns 200-OK if an email has been sent to the Customer or 404-Not Found if customerId not found.The reset email replaces the placeHolder [##ResetLink##] with the value in Setting Name resetPassword.resetLink and appends a token to use to change the password using the Change Password API. In this demo the reset password page is in /account/reset-password-page/{token}. To test it, replace {token} with the Token sent in the Reset Password Email.

### Change Password (Registered) ###

**Method:** PUT
**Url:** /api/account/change-password/{password}
**Header(s):** 	key: Authorization		value: {token}

The {password} is the new password.
The Api returns 200-OK if the password has been changed.

## Picture API ##

### PictureDTO ###

```c
int Id
string FileName
string AltAttribute //override alt attribute for img html element
string TitleAttribute //override title attribute for img html element
string FileAsBase64
```

### PagedPictureDTO ###

```c
PageResultDTO PageResult
List<PictureDTO> Pictures
```

### AddPicture (Admin only) ###

**Method:** POST

**Url:** /api/picture

**Header(s):** 	key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "FileName": "picture_books.jpg",
  "FileAsBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA...",  
  "AltAttribute":"override alt attribute for img html element",
  "TitleAttribute": "override title attribute for img html element"
}
```

FileName and FileasBase64 are compulsory. FileAsBase64 must have the FileType separated by a comma.
AltAttribute and TitleAttribute have null value as default when omitted.
The Api returns the PictureDto with the assigned Id.

### GetPictures (Admin only) ###

**Method:** GET

**Url:** /api/picture?currentPage={currentPage}&pageSize={pageSize}

**Header(s):** 	key: Authorization		value: {token}

The API returns a PictureDTO list of the {currentPage} of {pageSize} ordered by FileName.

### DeletePicture (Admin only) ###

**Method:** DELETE

**Url:** /api/picture/{id}

The {id} is the Picture Id to delete. Return 200-OK when the Picture has been deleted or 404-Not Found when PictureId does not exist. A Picture cannot be deleted when it is associated to a Category, to a Product or to a ProductAttribute.

## Category API ##

### CategoryDTO ###

```c
int Id
string Name
string Description
bool Published
int DisplayOrder
DateTime CreatedOnUtc
DateTime UpdatedOnUtc
PictureDto Picture
int ParentCategoryId //defines sub-categories
```

### AddCategory (Admin only) ##

**Method:** POST

**Url:** /api/category

**Header(s):**  key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "Name": "Books",
  "Description": "This is a category for books",
  "Published": true,
  "DisplayOrder": 1,
  "ParentCategoryId": 0,
  "Picture": {
       "Id": 1
  }
}
```

Id, CreatedOnUtc, UpdatedOnUtc are left blank, the Api will assign them a value.
ParentCategoryId is zero if Category is a Root Category otherwise it is the CategoryId of the Category Parent. In case there is not picture to upload, ignore the Picture field, set it to null or set Picture.Id equal to zero.
Name is compulsory, if Description is not provided, it will be defaulted to null. If Published is not provided it will be defaulted to true, if DisplayOrder is not provided it will be defaulted to zero, same for ParentCategoryId. The Api returns the CategoryDto with the assigned Id.

### UpdateCategory (Admin only) ###

**Method:** PUT

**Url:** /api/category

**Header(s):** 	key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
    "Id": 1,
    "Name": "Books",
    "Description": "This is a category for books",
    "Published": true,
    "DisplayOrder": 1,
    "ParentCategoryId": 0,
    "Picture":  {
        "Id": 2
    }
}
```
This is the same as AddCategory, the only difference is the Id which is the CategoryId to update.
CreatedOnUtc, UpdatedOnUtc are left blank, the Api will assign them a value.
The Api returns the updated CategoryDto or 404-Not Found if CategoryId is not found.


### GetCategories ###

**Method:** GET

**Url:** /api/category?filter={filter}

Returns all the Categories ordered by DisplayOrder and then by Name. It returns an empty list/array[] when nothing is found. If {filter} is not empty then it is used to filter by Category.Name. Only Admin can view the Not Published Categories.

### DeleteCategory (Admin only) ###

**Method:** DELETE

**Url:** /api/category/{id}

**Header(s):** 	key: Authorization		value: {token}

The {id} is the Category Id to delete. It returns 200-OK when the category has been deleted or 404-Not Found when CategoryId does not exist. A Category cannot be deleted if it contains products or sub-categories.

### GetCategoryByParentId ###

**METHOD:** GET

**Url:** /api/category/parent/{id}

The {id} is the ParentCategoryId. It returns the list of Categories whose ParentCategoryId is equal to id ordered by DisplayOrder and then by Name. It returns an empty list/array [] when nothing is found. Only Admin can view the Published Caategories.

### GetCategoryById ###

**Method:** GET

**Url:** /api/category/{id}

The {id} is the CategoryId. The Api returns the CategoryDto or error Not-Found if the CategoryId is not found. Only Admin can view the Published Caategories.

## Attribute API ##

### AttributeDTO ###

```c
int Id
string Name
```

### PageResultDTO ###

```c
int CurrentPage
int PageCount
int PageSize
int RowCount
```

### PagedAttributeDTO ###

```c
PageResultDTO PageResult
List<AttributeDTO> Attributes
```

### GetAttributes (Admin only) ###

**Method:** GET

**Url:** /api/attribute?currentPage={currentPage}&pageSize={pageSize}&filter={filter}

**Header(s):** 	key: Authorization		value: {token}

It returns all Attributes when {filter} is empty or ommitted, otherwise it searches {filter} in Attribute Name. The Api returns the PagedAttributeDTO. When there is no Attributes found, Attributes is an empty array. Attributes are ordered by Name.

### AddAttribute (Admin only) ###

**Method:** POST

**Url:** /api/attribute

**Header(s):** 	key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "Name": "Size"
}
```

Name is compulsory. The Api returns the AttributeDto with the assigned Id.

### UpdateAttribute (Admin only) ###

**Method:** PUT

**Url:** /api/attribute

**Header(s):**  key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "Id":1,
  "Name": "Colour"
}
```

Name and Id are compulsory. The Api returns the updated AttributeDto or 404-Not Found if AttributeId is not found.

### DeleteAttribute (Admin only) ###

**Method:** DELETE

**Url:** /api/attribute/{id}

**Header(s):**  key: Authorization		value: {token}

The {id} is the Attribute Id to delete. Return 200-OK when the Attribute has been deleted or 404-Not Found when AttributeId does not exist. You cannot delete an Attribute if associated to a Product.

### GetAttributeById (Admin only) ###

**Method:** GET

**Url:** /api/attribute/{id}

**Header(s):**  key: Authorization		value: {token}

The {id} is the AttributeId. The Api returns the AttributeDto or null if the AttributeId is not found.

## Discount API ##

### DiscountDTO ###
```c
int Id
string Name
int DiscountType
bool UsePercentage 
decimal DiscountPercentage
decimal DiscountAmount
DateTime StartDateUtc
DateTime EndDateUtc
List<DiscountAppliedToProductDTO> Products
```

### DiscountAppliedToProductDTO ###
```c
int Id
string Name
```

### PagedDiscountDTO ###
```c
PageResultDTO PageResult 
List<DiscountDTO> Discounts
```

### GetDiscounts (Admin only) ###

**Method:** GET

**Url:** /api/discount?currentPage={currentPage}&pageSize={pageSize}&filter={filter}

**Header(s):**  key: Authorization		value: {token}

It returns all Discounts when {filter} is empty or ommitted, otherwise it searches {filter} in Discount Name. The Api returns the PagedDiscountDTO. When there is no Discounts found, Discounts is an empty array. Discounts are ordered by Name.

### AddDiscount (Admin only) ###

**Method:** POST

**Url:** /api/attribute

**Header(s):** 	key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "Name": "Discount 10.5%",
  "DiscountType": 0,
  "UsePercentage": true,
  "DiscountPercentage": 10.5,
  "DiscountAmount": 0,
  "StartDateUtc": "2021-12-30T00:00:00",
  "EndDateUtc": "2022-12-30T23:59:59"
}
```
StartDateUtc and EndDateUtc are mandatory.
Name and DiscountType are compulsory. Valid Discount Type are:

        0 for AssignedToOrderTotal

        1 for AssignedToProducts

AssignedToOrderTotal: these discounts are applied to the entire customer order (order total).

In case of DiscountType = 1 which is AssignedToProducts, a list of productId are compulsory.
```json
{
  "Name": "Discount 10.5%",
  "DiscountType": 1,
  "UsePercentage": true,
  "DiscountPercentage": 10.5,
  "DiscountAmount": 0,
  "Products": [
    {
      "Id": 1
    },
    {
      "Id": 2
    }
  ],
  "StartDateUtc": "2021-12-30T00:00:00",
  "EndDateUtc": "2022-12-30T23:59:59"
}
```

The Api returns the DiscountDto with the assigned Id.

### UpdateDiscount (Admin only) ###

**Method:** PUT

**Url:** /api/discount

**Header(s):**  key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  "Id": 1, 
  //Same as AddDiscount with the Id to update.
}
```

### DeleteDiscount (Admin only) ###

**Method:** DELETE

**Url:** /api/discount/{id}

**Header(s):**  key: Authorization		value: {token}

The {id} is the Discount Id to delete. Return 200-OK when the Discount has been deleted or 404-Not Found when DiscountId does not exist. It also deleted the records in the link table such as DiscountAppliedToProduct.

## Setting API ##

### SettingDTO ###
```c
string Name
string Value
```

### PagedSettingDTO ###
```c
PageResultDTO PageResult 
List<SettingDTO> Settings
```
### GetSettings (Admin only) ###

**Method:** GET

**Url:** /api/setting?currentPage={currentPage}&pageSize={pageSize}&filter={filter}

**Header(s):**  key: Authorization		value: {token}

It returns all Settings when {filter} is empty or ommitted, otherwise it searches {filter} in Setting Name. The Api returns the PagedSettingDTO.

### List of possible Settings ###
#### confirmationEmail.subject ####
Subject for the confirmation email sent by the account/register API.
#### confirmationEmail.bodyHtml ####
Body in html format for the confirmation email sent by the account/register API.
In confirmationEmail.bodyHtml you can add placeholders such as: 
[##BillingFirstName##]
[##BillingLastName##]
[##ConfirmationLink##]
These placeholders will be replaced with the actual value in the account/register API. For example:
“Dear [##UserName##],<br/> Please click on the link below to confirm your email address:<br/><br/>[##ConfirmationLink##]”
#### confirmationEmail.confirmationLink #### 
This is the url of the confirmation page where the customer confirm his/her registration, for example ConfirmationLink could be something like: http://www.yourstore.confirmationpage.html. The Register API replaces [##ConfirmationLink##] placeHolder with the actual link and appends the CustomerGuid: http://www.yourstore.confirmationpage.html/5015d994-bddf-4c58-aa4c-71e4471a9089 The Confirmation Page must read the CustomerGuid and call the Confirm API to activate the customer.
#### confirmationEmail.verifyRequest.reCAPTCHA.v2 ###
The default value is set to true. If you do not want to verify the request set it to false. This means any tool can call this API automatically. When you use the reCAPTCHA v2, you must login to https://www.google.com/recaptcha
go in Admin Console, do the login and register your stored domain. Also you need to set up the secret key in the app.setting.json file.
#### resetPassword.subject ####
Subject for the reset password email.
#### resetPassword.bodyHtml ####
Body in html format for the reset password email.
The new password is in the placeHolder: [##NewPassword##]
#### orderCreatedEmail.subject ####
This is the subject of the email sent to the customer after the order has been created.
#### orderCreatedEmail.bodyHtml ####
This is the body in html format of the email sent to the customer after the order has been created. The following placeholders will be replace with the actual value:
[##BillingFirstName##], [##BillingLastName##], [##BillingCompany##], [##BillingAddress1##], [##BillingAddress2##], [##BillingCity##], [##BillingZipPostalCode##], [##BillingStateProvince##], [##BillingCountry##], [##ShippingFirstName##], [##ShippingLastName##], [##ShippingCompany##], [##ShippingAddress1##], [##ShippingAddress2##], [##ShippingCity##], [##ShippingZipPostalCode##], [##ShippingStateProvince##], [##ShippingCountry##], [##OrderReference##],[##OrderDate##], [##ShippingMethod##], [##TotalShipping##], [##TotalItems##], [##TotalItemsDiscount##], [##TotalOrderDiscount##], [##TotalDiscount##], [##TotalTax##], [##TotalToPay##], [##PaymentMethod##], [##ProductList##] (this is the place holder for the orderCreatedEmail.bodyHtml.product.items)
Here an example:
```html
<table>
  <tr>
    <td>
      My Store<br/>
      My Address<br/>
      My Country<br/>
      My Email<br/>
      My Phone Number<br/>
      Order Reference: [##OrderReference##]<br/>
      Order Date: [##OrderDate##]
    </td>
  </tr>
  <tr>
    <td>
      Payment Method: [##PaymentMethod##]<br/>
      <b>Billing Address:</b><br/>
      [##BillingFirstName##]<br/> 
      [##BillingLastName##]<br/> 
      [##BillingCompany##]<br/> 
      [##BillingAddress1##]<br/> 
      [##BillingAddress2##]<br/> 
      [##BillingCity##]<br/> 
      [##BillingZipPostalCode##]<br/> 
      [##BillingStateProvince##]<br/> 
      [##BillingCountry##]
    </td>
  </tr>
  <tr>
    <td>
      <b>Shipping Method:</b> [##ShippingMethod##]<br/>
      <b>Shipping Address:</b><br/>
      [##ShippingFirstName##]<br/> 
      [##ShippingLastName##]<br/> 
      [##ShippingCompany##]<br/> 
      [##ShippingAddress1##]<br/> 
      [##ShippingAddress2##]<br/> 
      [##ShippingCity##]<br/> 
      [##ShippingZipPostalCode##]<br/> 
      [##ShippingStateProvince##]<br/> 
      [##ShippingCountry##]
    </td>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
            <td><b>Product</b></td>
            <td><b>Quantity</b></td>
            <td><b>Unit Price</b></td>
            <td><b>Tax Rate (%)</b></td>
            <td><b>Discount Amount</b></td>
            <td><b>Sub Total (Excl. Tax)</b></td>
            <td><b>Sub Total (Incl. Tax)</b></td>
        </tr>
        [##ProductList##]
      </table>  
    </td>
  </tr>
  <tr>
    <td>
      <b>Totals:</b><br/>
      Total Shipping: [##TotalShipping##]<br/>
      Total Items: [##TotalItems##]<br/>
      Total Items Discount: [##TotalItemsDiscount##]<br/>
      Total Order Discount: [##TotalOrderDiscount##]<br/>
      Total Discount: [##TotalDiscount##]<br/>
      Total Tax: [##TotalTax##]<br/>
      Total To Pay: [##TotalToPay##]
    </td>
  </tr>
</table>
```

#### orderCreatedEmail.bodyHtml.product.items ####
This is the template for the list of products to set in the body of the email sent to the customer after the order has been created. The following placeholders will be replaces with the actual value: [##Product##], [##Quantity##], [##UnitPrice##], [##TaxRate##], [##DiscountAmount##], [##TotalToPayExclTax##], [##TotalToPayInclTax##]. Here an example:

```html
    <tr>
        <td>[##Product##]</td>
        <td>[##Quantity##]</td>
        <td>[##UnitPrice##]</td>
        <td>[##TaxRate##]</td>
        <td>[##DiscountAmount##]</td>
        <td>[##TotalToPayExclTax##]</td>
        <td>[##TotalToPayInclTax##]</td>
    </tr>
```

### UpdateSetting (Admin only) ###

**Method:** PUT

**Url:** /api/setting

**Header(s):** 	key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
    "Name": "confirmationEmail.subject",
    "Value": "My Store: confirmation email"
}
```
Name is the primary key. This API updates the Value or returns error 404 – not found if the name does not exist. The Api returns the updated SettingDTO.

## Product API ##

### ProductCategoryDTO ###
```c
int Id
string Name
string Description
bool Published
int DisplayOrder
PictureDto Picture
int ParentCategoryId //defines sub-categories
```

### ProductPictureDTO ###
```c
int Id
string FileName
string AltAttribute //override alt attribute for img html element
string TitleAttribute //override title attribute for img html element
string FileAsBase64
int DisplayOrder
```

### ProductAttributeValueDTO ###
```c
int Id 
string Name
decimal PriceAdjustment
bool? PriceAdjustmentUsePercentage
decimal WeightAdjustment
int Quantity
bool? IsPreSelected
int DisplayOrder
PictureDto Picture //pictureId to display when this option is selected
```
### PagedProductDTO ###
```c
PageResultDTO PageResult 
List<ProductDTO> Products
```

### ProductAttributeDTO ###
```c
int Id
string Name
int DisplayOrder
string PromptText
bool IsRequired
int SelectedAttributeValueId //AttributeValueId of the Pre-selected Value
List<ProductAttributeValueDTO> Values
```

### ProductDiscountDTO ###
```c
int Id
string Name
bool UsePercentage
decimal DiscountPercentage
decimal DiscountAmount
DateTime StartDateUtc
DateTime EndDateUtc
```

### ProductDTO ###
```c
int Id
string Name
string Sku
string ShortDescription
string FullDescription
int ManageInventoryType
int StockQuantity
decimal Price
decimal DiscountAmount
decimal OldPrice
decimal Weight
decimal Length
decimal Width
decimal Height
decimal TaxRate
int DisplayOrder
bool? Published 
DateTime? CreatedOnUtc
DateTime? UpdatedOnUtc
List<ProductCategoryDTO> Categories 
ProductPictureDTO Picture //it is either the first picture in Pictures or the selected Attribute Value Picture
List<ProductPictureDTO> Pictures 
List<ProductAttributeDTO> Attributes
List<ProductDiscountDto> Discounts
```

### GetProducts ###

**Method:** GET

**Url:** /api/product?categoryId={categorytId}&currentPage={currentPage}&pageSize={pageSize}&productName={productName}&orderBy={displayOrder}&orderType={ASC}

It filters by {categoryId} and {productName}. The Api returns the PagedProductDTO. When there is no Products found, Products is an empty array. Possible values for orderBy: {displayOrder, name, price} and for orderType: {ASC, DESC}. Default values for order by is displayOrder, while for orderType is ASC. Only Admin can view Not Published Products. Discounts only contains valid discounts based on Start and End dates.

### GetProductById ###

**Method:** GET

**Url:** /api/product/{id}

The {id} is the ProductId. The API returns the ProductDTO or null if the ProductId is not found. Only Admin can view Published Products.

### AddProduct (Admin only) ###

**Method:** POST

**Url:** /api/product

**Header(s):**  key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
    "Name": "Table Chair",
    "Sku": "Chair001",
    "ShortDescription": "A short description for chair",
    "FullDescription": "A long description for chair",
    "ManageInventoryType": 0,
    "StockQuantity": 100,
    "OldPrice": 10.99,
    "Price": 9.99,
    "Weight": 2.34,
    "Length": 1.56,
    "Width": 3.67,
    "Height": 2.67,
    "TaxRate": 19.5,
    "Published": true,
    "DisplayOrder": 1,
    "Categories": [
        {
            "Id": 5
        }
    ],
    "Attributes": [
        {
            "Id": 1,
            "DisplayOrder": 1,
            "PromptText": "Please select a colour",
            "IsRequired": true,
            "Values": [
                {
                    "Name": "Red",
                    "PriceAdjustment": 1,
                    "PriceAdjustmentUsePercentage": true,
                    "WeightAdjustment": 2,
                    "Quantity": 10,
                    "IsPreSelected": true,
                    "DisplayOrder": 1,
                    "Picture": {
                        "Id": 1
                    }
                },
                {
                    "Name": "White",
                    "PriceAdjustment": 2,
                    "PriceAdjustmentUsePercentage": false,
                    "WeightAdjustment": 3,
                    "Quantity": 100,
                    "IsPreSelected": false,
                    "DisplayOrder": 2
                }
            ]
        },
        {
            "Id": 2
        }
    ],
    "Pictures": [
        {
            "Id": 1,
            "DisplayOrder": 1
        },
        {
            "Id": 2,
            "DisplayOrder": 2
        }
    ]
}  
```
Name is compulsory, If ShortDescription and FullDescription are not provided, they will be defaulted as null. If Published is not provided it will be defaulted as true, if DisplayOrder is not provided it will be defaulted as zero, Same for Price. Sku is the internal unique identifier.
ManageInventoryType can have the following values:

        0 for DontTrackInventory,
		1 for TrackInventory,
        2 for TrackInventoryByProductAttributes

A Product can be assigned to more than one Category, in the Categories field just add the list of CategoryId. In the Attributes field, add the list of Attribute Id to associate to the Product. When there is no Attributes to associate, then set this field as an empty array or simply omit this field. The Attribute has Values which is a list of ProductAttributeValueDtTO.
In the Pictures field add the list of PictureId. If there is no Picture, then either set Picture equal to an empty array “Picture”: [] or omit this field. DisplayOrder has default value equal to zero. The Api returns the ProductDTO with the assigned Id.

### UpdateProduct (Admin only) ###

**Method:** PUT

**Url:** /api/product

**Header(s):**  key: Content-Type 		value: application/json
                key: Authorization		value: {token}

**Body:**
```json
{
  Id: 1,
  //Same as AddProduct with the Product Id to update.
}
```
Same as AddProduct, in this case there is Id which is the ProductId to update. The API returns the updated ProductDTO or Error 404 Not Found if ProductId is not found.

### DeleteProduct (Admin only) ###

**Method:** DELETE

**Url:** /api/product/{id}

**Header(s):**  key: Authorization		value: {token}

{id} is the Product Id to delete. Return 200-OK when the product has been deleted or Error 4040 - Not Found when ProductId does not exist. The deletion of the Product deletes also the associated DTO, such as ProductAttribute and ProductAttributeValue. A product cannot be delete when is in the ShoppingCart and/or in an Order.

## ShoppingCart API ##

### ShoppingCartDTO ###
```c
Guid Id
string Mode

//Billing Address
string BillingFirstName
string BillingLastName
string BillingCompany
string BillingAddress1
string BillingAddress2
string BillingCity
string BillingZipPostalCode
string BillingStateProvince
string BillingStateProvinceCode
string BillingCountry
string BillingCountryCode

//Shipping Address
bool ShippingSameAsBillingAddress
string ShippingFirstName
string ShippingLastName
string ShippingCompany
string ShippingAddress1
string ShippingAddress2
string ShippingCity
string ShippingZipPostalCode
string ShippingStateProvince
string ShippingStateProvinceCode
string ShippingCountry
string ShippingCountryCode

string ShippingMethod
decimal TotalShipping

decimal TotalItems
decimal TotalItemsDiscount
decimal TotalOrderDiscount
decimal TotalTax

bool TotalOrderDiscountUsePercentage
decimal TotalOrderDiscountPercentage
decimal TotalOrderDiscountAmount

decimal TotalToPay
//TotalToPay = TotalItems - TotalDiscount + TotalTax + TotalShipping
string PaymentMethod
string PaymentReference
//It is used to make a handshake between Client and WebHook

DateTime? CreatedOnUtc
DateTime? UpdatedOnUtc

List<ShoppingCartItemDTO> Items
```

### ShoppingCartItemDTO ###
```c
int Id
string Name
string Sku
PictureDto Picture
int Quantity
decimal UnitPrice
decimal TaxRate
decimal DiscountAmount
decimal TotalItem
//TotalItem = (UnitPrice * Quantity)
decimal TotalToPay
//TotalToPay = (TotalItem - DiscountAmount) (1 + TaxRate) / 100
List<ShoppingCartItemAttributeValueDTO> AttributeValues
```

### ShoppingCartItemAttributeValueDTO ###
```c
int Id
string Name
string Value
decimal PriceAdjustment
```
### GetShoppingCart ###

**Method:** GET
**Url:** /api/shoppingcart/{id}

{id} is the Guid that identifies the ShoppingCart. The API returns the ShoppingCartDTO whose Id is equal to {id}. If {id} does not exist it returns a ShoppingCartDTO with an empty Item list.


### UpdateShoppingCartItem (Registered in checkout mode) ###

**Method:** PUT
**Url:** /api/shoppingcart
**Header(s):**      key: Content-Type 		value: application/json
(in checkout mode)   key: Authorization		value: {token} 
**Body:**
```json
{
	"Mode": "cart",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "Items": [
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 1
                }
            ],
            "Picture": {
                "Id": 1
            }
        }      
    ]
}
```
The above example adds an Item to the ShoppingCart. Item.Id is the Product.Id. An Item is identified in a unique way by Product.Id and Attribute(s).Id. To remove it from the ShoppingCart list, set Quantity equal to zero. If the Item already exists, the Quantity value will be set to the existing Quantity.

Mode can be: 
*cart, in this mode, the API edits the ShoppingCart
*customer, in this mode, the API only edits the Customer Details
*tax, in the mode, the API only edits the TaxRates of the Items
*shipping, in this mode, the API only edits Shipping Info
*checkout, this mode the API edits customer, tax and shipping at the same time.
 
ShoppingCart.Id is a Guid, it identifies the ShoppingCart and it is compulsory. The UI must generate a GUID and saves it in a localstorage to use when updating the Shopping Cart. 
Please note Item.id (which is the Product.Id) and ProductAttributeValues.id identify in a unique way the product in the Shopping Cart. The following example shows how to update the Shopping Cart using the same product with different AttributeValues.
```json
{
	"Mode": "cart",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "Items": [
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 1
                }
            ],
            "Picture": {
                "Id": 1
            }
        },
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        },
        {
            "Id": 1,
            "Quantity": 1
        },
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 1
                },
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        }
    ]
}
```
The Api returns the updated ShoppingCartDTO..

To update only the Customer Billing and Shipping addresses, call the API in customer mode. The following example shows how:
```json
{
    "Mode": "customer",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "BillingFirstName": "Woodsy",
    "BillingLastName": "Forest",
    "BillingCompany": "my billing company",
    "BillingAddress1": "my billing address1",
    "BillingAddress2": "my billing address2",
    "BillingCity": "my billing city",
    "BillingZipPostalCode": "my billing zip postalcode",
    "BillingStateProvince": "my billing state province",
    "BillingStateProvinceCode": "my billing state province code",    
    "BillingCountry": "my billing country",
    "BillingCountryCode": "my billing country code",   
    "ShippingSameAsBillingAddress": false,
    "ShippingFirstName": "my shipping firstname",
    "ShippingLastName": "my shipping lastname",
    "ShippingCompany": "my shipping company",
    "ShippingAddress1": "my shipping address1",
    "ShippingAddress2": "my shipping address2",
    "ShippingCity": "my shipping city",
    "ShippingZipPostalCode": "my shipping zip postalcode",
    "ShippingStateProvince": "my shipping state province",
    "ShippingStateProvinceCode": "my shipping state province code",    
    "ShippingCountry": "my shipping country",
    "ShippingCountryCode": "my shipping country code",    
    "Items": [
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 1
                }
            ],
            "Picture": {
                "Id": 1
            }
        },
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        },
        {
            "Id": 1,
            "Quantity": 1
        },
        {
            "Id": 1,
            "Quantity": 1,
            "AttributeValues": [
                {
                    "Id": 1
                },
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        }
    ]      
} 
```
Or simply this:
```json
{
    "Mode": "customer",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "BillingFirstName": "Woodsy",
    "BillingLastName": "Forest",
    "BillingCompany": "my billing company",
    "BillingAddress1": "my billing address1",
    "BillingAddress2": "my billing address2",
    "BillingCity": "my billing city",
    "BillingZipPostalCode": "my billing zip postalcode",
    "BillingStateProvince": "my billing state province",
    "BillingStateProvinceCode": "my billing state province code",    
    "BillingCountry": "my billing country",
    "BillingCountryCode": "my billing country code",   
    "ShippingSameAsBillingAddress": false,
    "ShippingFirstName": "my shipping firstname",
    "ShippingLastName": "my shipping lastname",
    "ShippingCompany": "my shipping company",
    "ShippingAddress1": "my shipping address1",
    "ShippingAddress2": "my shipping address2",
    "ShippingCity": "my shipping city",
    "ShippingZipPostalCode": "my shipping zip postalcode",
    "ShippingStateProvince": "my shipping state province",
    "ShippingStateProvinceCode": "my shipping state province code",    
    "ShippingCountry": "my shipping country",
    "ShippingCountryCode": "my shipping country code"     
} 
```
To update the TaxRate of the Products:
```json
{
    "Mode": "tax",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "Items": [
        {
            "Id": 1,
            "Quantity": 1,
            "TaxRate": 10,
            "AttributeValues": [
                {
                    "Id": 1
                }
            ],
            "Picture": {
                "Id": 1
            }
        },
        {
            "Id": 1,
            "Quantity": 1,
            "TaxRate": 10,
            "AttributeValues": [
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        },
        {
            "Id": 1,
            "Quantity": 1,
            "TaxRate": 10
        },
        {
            "Id": 1,
            "Quantity": 1,
            "TaxRate": 10,
            "AttributeValues": [
                {
                    "Id": 1
                },
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        }
    ]      
} 
```
While to Update the Shipping Info:
```json
{
    "Mode": "shipping",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "TotalShipping": "20",
    "ShippingMethod": "Standard Delivery"     
} 
```
To Update Customer Details, Tax Rate and Shipping Info in one go:
```json
{
    "Mode": "checkout",
    "Id": "05373BF4-A179-41B9-8933-7641ECC323C8",
    "BillingFirstName": "Woodsy-",
    "BillingLastName": "Forest-",
    "BillingCompany": "my billing company-",
    "BillingAddress1": "my billing address1-",
    "BillingAddress2": "my billing address2-",
    "BillingCity": "my billing city-",
    "BillingZipPostalCode": "my billing zip postalcode-",
    "BillingStateProvince": "my billing state province-",
    "BillingCountry": "my billing country-",
    "ShippingSameAsBillingAddress": false,
    "ShippingFirstName": "my shipping firstname-",
    "ShippingLastName": "my shipping lastname-",
    "ShippingCompany": "my shipping company-",
    "ShippingAddress1": "my shipping address1-",
    "ShippingAddress2": "my shipping address2-",
    "ShippingCity": "my shipping city-",
    "ShippingZipPostalCode": "my shipping zip postalcode-",
    "ShippingStateProvince": "my shipping state province-",
    "ShippingCountry": "my shipping country-",    
    "TotalShipping": "30",
    "ShippingMethod": "Standard Delivery-",
    "PaymentMethod": "Check / Money Order",
    "Items": [
        {
            "Id": 1,
            "TaxRate": 20,
            "AttributeValues": [
                {
                    "Id": 1
                }
            ],
            "Picture": {
                "Id": 1
            }
        },
        {
            "Id": 1,
            "TaxRate": 20,
            "AttributeValues": [
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        },
        {
            "Id": 1,
            "TaxRate": 20
        },
        {
            "Id": 1,
            "TaxRate": 20,
            "AttributeValues": [
                {
                    "Id": 1
                },
                {
                    "Id": 2
                }
            ],
            "Picture": {
                "Id": 2
            }
        }
    ]               
} 
```

## Customer API ##

### CustomerDTO ###
```c
int Id
string Email
string PhoneNumber

//Billing Address
string BillingFirstName
string BillingLastName
string BillingCompany
string BillingAddress1
string BillingAddress2
string BillingCity
string BillingZipPostalCode
string BillingStateProvince
string BillingStateProvinceCode
string BillingCountry
string BillingCountryCode

//Shipping Address
bool ShippingSameAsBillingAddress
string ShippingFirstName
string ShippingLastName
string ShippingCompany
string ShippingAddress1
string ShippingAddress2
string ShippingCity
string ShippingZipPostalCode
string ShippingStateProvince
string ShippingStateProvinceCode
string ShippingCountry
string ShippingCountryCode

//Created Date
DateTime? CreatedOnUtc
bool IsActive
int FailedLoginAttempts
DateTime LastLoginDateUtc
Guid CustomerGuid
List<RoleDTO> Roles
```

### RoleDTO ###
```c
int Id
string Name
bool IsActive
bool IsSytemRole
string SystemName
```

### PagedCustomerDTO ###
```c
CustomerDTO Customers
PageResultDto PageResult
```

### GetCustomerById (Registered or Admin) ###

**Method:** GET

**Url:** /api/customer/{id}

**Header(s):**  key: Authorization		value: {token}

{id} is the CustomerId. The API return CustomerDTO if the CustomerId is found, otherwise it returns 404-Not Found error. Admin can view all Customers, while Registered can only view their own profile.

### GetCustomers (Admin) ###

**Method:** GET

**Url:** /api/customer?lastname=&currentPage=1&pageSize=10

**Header(s):**  key: Authorization		value: {token}

It returns the PagedCustomerDTO. When lastname is not blank, then it filters by lastname. The customer are ordered by Lastname.

### UpdateCustomerById (Registered or Admin) ###

**Method:** PUT
**Url:** /api/customer
**Header(s):** key: Content-Type 		value: application/json
               key: Authorization		value: {token}
**Body:**
```json
{
    "Id": 14,
    "Email": "admin@yourstore.com",
    "PhoneNumber": "020345612",
    "BillingFirstName": "Woodsy",
    "BillingLastName": "Forest",
    "BillingCompany": "My Company",
    "BillingAddress1": "My Street1",
    "BillingAddress2": "My Street2",
    "BillingCity": "London",
    "BillingZipPostalCode": "W11 F12",
    "BillingStateProvince": "Greater London",
    "BillingStateProvinceCode": "GL",
    "BillingCountry": "United Kingdom",
    "BillingCountryCode": "UK",
    "ShippingSameAsBillingAddress": true,
    "ShippingFirstName": "",
    "ShippingLastName": "",
    "ShippingCompany": "",
    "ShippingAddress1": "",
    "ShippingAddress2": "",
    "ShippingCity": "",
    "ShippingZipPostalCode": "",
    "ShippingStateProvince": "",
    "ShippingStateProvinceCode": "",
    "ShippingCountry": "",
    "ShippingCountryCode": "",
    "IsActive": true,
    "FailedLoginAttempts": 0,
}
```
This API updates the customer whose Id is equal to the {id} in the Body. It returns the updated CustomerDTO. Registered can only updates their own profile while Admin can updates any Customer.
When ShippingSameAsBillingAddress is set to true, all the Shipping Details are ignored and set to null in the table. These fields: CreatedOnUtc, LastLoginDateUtc, CustomerGuid, Roles cannot be overwritten.

## Country API ##

### CountryDTO ###
```c
int Id
string Name
string TwoLetterIsoCode
string ThreeLetterIsoCode
int NumericIsoCode
bool Published
int DisplayOrder
```

### GetCountries ###

**Method:** GET
**Url:** /api/country

The Api returns the list of CountryDTO order by DisplayORder and then by Name. Only Admin can view Not Published.

### AddCountry (Admin only) ###

**Method:** POST
**Url:** /api/country
**Header(s):**   key: Content-Type 		value: application/json
                 key: Authorization		value: {token}
**Body:**
```json
{
    "Name": "New Country",
    "TwoLetterIsoCode": "NC",
    "ThreeLetterIsoCode": "NCA",
    "NumericIsoCode": 1634,
    "Published": true,
    "DisplayOrder": 100
}
```
Name is compulsory. The Api returns the CountryDTO with the assigned Id.

### UpdateCountry ###

**Method:** PUT
**Url:** /api/country
**Header(s):**   key: Content-Type 		value: application/json
**Body:**
```json
{
    "Id": 242,
    "Name": "New Country1",
    "TwoLetterIsoCode": "N1",
    "ThreeLetterIsoCode": "NC1",
    "NumericIsoCode": 84012,
    "Published": false,
    "DisplayOrder": 101
}
```
Name and Id are compulsory. The Api returns the updated CountryDTO or 404-Not Found if CountryId is not found.

### DeleteAttribute ###

**Method:** DELETE
**Url:** /api/country/{id}

The {id} is the CountryId to delete. Return 200-OK when the Country has been deleted or 404-Not Found when Country does not exist. You cannot delete a Country if associated to a StateProvince.


## StateProvince API ##

### StateProvinceDTO ###
```c
int Id
int CountryId
string Name
string Abbreviation
bool Published
int DisplayOrder
```

### GetStateProvincesByCountryId ###

**Method:** GET
**Url:** /api/stateprovince/country/{id}
**Header(s):**   key: Authorization		value: {token}

The Api returns the list of StateProvinceDTO whose CountryId is equal to {id} or an empty list if nothing is found. The list of the returned StateProvinceDTO are ordered by DisplayOrder and then by Name. Only Admin can view Not Published.

### AddStateProvince (Admin only) ###

**Method:** POST
**Url:** /api/stateprovince/
**Header(s):** 
	key: Content-Type 		value: application/json
    key: Authorization		value: {token}
**Body:**
```json
{
    "CountryId": 241,
    "Name": "New York",
    "Abbreviation": "NY",
    "Published": true,
    "DisplayOrder": 100
}
```
CountryId and Name are compulsory.
The Api returns the StateProvinceDTO with the assigned Id.

### DeleteStateProvince (Admin only) ###

**Method:** DELETE
**Url:** /api/stateprovince/{id}
**Header(s):**    key: Authorization		value: {token}

The {id} is the StateProvince Id to delete. Return 200-OK when the StateProvince has been deleted or 404-Not Found when StateProvinceId does not exist.

## Order API ##

### OrderDTO ###
```c
int Id
Guid CartId

int CustomerId

//Billing Address
string BillingFirstName
string BillingLastName
string BillingCompany
string BillingAddress1
string BillingAddress2
string BillingCity
string BillingZipPostalCode
string BillingStateProvince
string BillingStateProvinceCode
string BillingCountry
string BillingCountryCode

//Shipping Address
bool ShippingSameAsBillingAddress
string ShippingFirstName
string ShippingLastName
string ShippingCompany
string ShippingAddress1
string ShippingAddress2
string ShippingCity
string ShippingZipPostalCode
string ShippingStateProvince
string ShippingStateProvinceCode
string ShippingCountry
string ShippingCountryCode
string ShippingMethod
decimal TotalShipping
decimal TotalItems
decimal TotalItemsDiscount
decimal TotalOrderDiscount
decimal TotalTax
decimal TotalToPay
string PaymentMethod
string PaymentReference
DateTime CreatedOnUtc
List<OrderStatusDTO> OrderStatuses
List<OrderItemDTO> OrderItems
List<OrderNoteDTO> OrderNotes
```

### OrderItemDTO ###
```c
int Id
int Quantity
decimal UnitPrice
decimal TaxRate
decimal DiscountAmount
decimal TotalItem
decimal TotalToPay
string ProductId
string ProductName
string ProductAttributeDescriptions
```

### OrderNoteDTO ###
```c
int Id
string Note
DateTime? CreatedOnUtc
```

### OrderStatusDTO ###
```c
int Id
string Name
DateTime? CreatedOnUtc
```

### PagedOrderDTO ###
```c
PageResultDto PageResult
List<OrderDto> Orders
```

### CreateOrder only for Check/Money Order (Registered role) ###

**Method:** POST
**Url:** /api/order/check-money-order
**Body:**
```json
{
  "CartId": "2C476AA5-70B1-4711-BED2-B2690D60BFAD",
  "ReCaptchaResponse": "whatever...",
}
```
**Header(s):** key: Authorization		value: {token}
               key: Content-Type        value: application/json

CartId is the Id of the shoppingCart. ReCaptchaResponse is the response of the Google Recaptcha when activated. To disable it (not recommended because they can easily spam orders), set equal to false this setting: 'createOrder.checkMoneyOrder.verifyRequest.reCAPTCHA.v2'. The API returns the OrderID when the order has been created. The created order will be in the Created Status.

### CreateOrder only for PayPal Smart Payment Buttons (Registered role) ###

**Method:** POST
**Url:** /api/order/paypal-smart-payment?cartId={cartId}&orderId={orderId}

{orderId} is the OrderId returned after the payment has been approved on the client side and it is used by the API to check whether the payment has actually been completed.

### GetOrderById (Admin or Registered role) ###

**Method:** GET
**Url:** /api/order/{id}
**Header(s):** key: Authorization		value: {token}

{id} is the orderId. The API return the OrderDTO if the {id} is found otherwise it returns Error 404-Not Found. Registered can only view their own Orders, while Admin can view them all.

### GetOrders (Admin or Registered role) ###

**Method:** GET
**Url:** /api/order?lastname={lastname}&currentPage={currentPage}&pageSize={pageSize}
**Header(s):** key: Authorization		value: {token}

The API returns a PagedOrderDTO. When {lastname} has a value then it filter by BillingLastname. PageOrderDTO.Orders contains the {currentPage} of the Order list ordered by BillingLastname with pageSize equal to {pageSize}. Admin can retrive all orders while Registered only theirs.

### AddOrderNote (Admin) ###

**Method:** POST
**Url:** /api/order/{id}/note
**Header(s):** key: Authorization		value: {token}
**Body:**
```json
{
  "Note": "This is a Order Note"
}
```

{id} is the OrderId. Note is the note to add to the OrderId. It returns the updated OrderDTO.

### DeleteOrderNote (Admin) ###

**Method:** DELTE
**Url:** /api/order/{orderId}/note/{id}
**Header(s):** key: Authorization		value: {token}

{orderId} is the OrderId, {id} is the NoteId to delete. It returns the updated OrderDTO.

### UpdateOrderStatus ###

**Method:** PUT
**Url:** /api/order/{id}/status
**Header(s):** key: Authorization		value: {token}
**Body:**
```json
{
  "Id": 2
}
```
{id} is the OrderId to update. Id in the body is the new StatusId to set in the order. It returns the updated OrderDTO.

## Status API ##

### StatusDTO ###
```c
int Id
string Name
bool? IsSytemStatus
string SystemName
```

### GetStatuses (Admin) ###

**Method:** GET
**Url:** /api/status
**Header(s):** key: Authorization		value: {token}

It returns the list of StatusDTO.
