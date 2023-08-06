var price;
var quantity;
var amount;
var prod_name;
var ids;

var products = [];

// Add a global variable to keep track of the last used ID
var lastUsedId = 0;

function calculate() {
  var price = parseFloat(document.getElementById("prc").value);
  var quantity = parseFloat(document.getElementById("qty").value);
  var amount = price * quantity;
  document.getElementById("amnt").value = amount.toFixed(2);
}

function addData() {
  lastUsedId++; // Increment the last used ID
  var id = lastUsedId;

  // var id = document.getElementById("ids").value;
  var prod_name = document.getElementById("product").value;
  var price = parseFloat(document.getElementById("prc").value);
  var quantity = parseFloat(document.getElementById("qty").value);
  var amount = price * quantity;

  products.push({
    id: id,
    prod_name: prod_name,
    price: price,
    quantity: quantity,
    amount: amount,
  });

  var tableBody = document.getElementById("newtr");
  var newRow = `<tr>
      <td>${id}</td>
      <td>${prod_name}</td>
      <td>${price}</td>
      <td>${quantity}</td>
      <td>${amount.toFixed(2)}</td>
      <td class="remove-on-pdf"><button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button></td>
     </tr>`;
  tableBody.innerHTML += newRow;

  updateSubtotalAndTotal();
  // Clear input fields in "quotation-details" section
  var quotationDetailsInputs = document.querySelectorAll(
    ".quotation-details input"
  );
  quotationDetailsInputs.forEach((input) => (input.value = ""));
  // Display logo when there are more than 5 IDs in the table
  var logoContainer = document.querySelector(".rotate-logo");
  var showLogo = products.length >= 5;
  logoContainer.classList.toggle("show-logo", showLogo);
}

function updateSubtotalAndTotal() {
  var subtotal = 0;
  for (var i = 0; i < products.length; i++) {
    subtotal += products[i].amount;
  }
  document.getElementById("subtotal-amount").innerHTML = subtotal.toFixed(2);

  var total = subtotal; // You can add taxes or other charges here if needed.
  document.getElementById("total").innerHTML = total.toFixed(2);

  // Update the "Quotation Total" input field with the calculated total
  var quotationTotalInput = document.getElementById("quotationTotalInput");
  quotationTotalInput.value = total.toFixed(2);
}

function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  var index = row.rowIndex - 1; // -1 to account for the header row
  var deletedAmount = products[index].amount;
  products.splice(index, 1);
  document.getElementById("newtr").deleteRow(index);
  updateSubtotalAndTotal();
}

// Clear all input fields and reset the products array
function resetForm() {
  document.getElementById("ids").value = "";
  document.getElementById("product").value = "";
  document.getElementById("prc").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("amnt").value = "";
  document.getElementById("subtotal-amount").innerHTML = "0.00";
  document.getElementById("total").innerHTML = "0.00";
  document.getElementById("newtr").innerHTML = "";
  products = [];
}

//Create PDf from HTML...
$(document).ready(function () {
  // Add a click event listener to the button
  $("#downloadPdfButton").on("click", function () {
    var PDF_Width = 595.28;
    var PDF_Height = 841.89;
    var top_left_margin = 15;
    var canvas_image_width = 570.28;
    var canvas_image_height = 810.89;
    var totalPDFPages = 0; // Update this with the number of pages you want in the PDF
    var imageDPI = 300; // Adjust this value to increase/decrease quality (dpi)

    // Add a CSS class to hide the "Remove Id." column and the "Delete" buttons during PDF generation
    $(".remove-on-pdf").hide();

    html2canvas($(".pdf")[0], { scale: imageDPI / 96 }).then(function (canvas) {
      // Show the "Remove Id." column and the "Delete" buttons again after capturing the screenshot
      $(".remove-on-pdf").show();

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("QuotationFor_CCTV-Enquiry.pdf");
      $(".html-content").hide();
    });
  });
});

function resetForm() {
  // Rest of the code...
  products = [];
  lastUsedId = 0; // Reset the last used ID
}

let timeoutId;

// Function to hide the greeting pop-up and set a cookie
function hideGreetingPopup() {
  const greetingPopup = document.querySelector(".greeting-popup");
  const blurBackground = document.querySelector(".blur-background");
  greetingPopup.style.display = "none";
  blurBackground.style.display = "none";

  // Set a cookie to remember that the pop-up was closed
  document.cookie =
    "greetingPopupClosed=true; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/";

  // Clear the timeout to prevent it from triggering after the pop-up is closed
  clearTimeout(timeoutId);
}

// Check if the greeting pop-up has been shown before (check cookie)
const hasShownGreeting = document.cookie.includes("greetingPopupClosed=true");

// If not, show the greeting pop-up
if (!hasShownGreeting) {
  const greetingPopup = document.querySelector(".greeting-popup");
  const blurBackground = document.querySelector(".blur-background");

  greetingPopup.style.display = "block";
  blurBackground.style.display = "block";

  // Add an event listener to the pop-up button to hide it when clicked
  const greetingButton = greetingPopup.querySelector("button");
  greetingButton.addEventListener("click", hideGreetingPopup);

  // Hide the pop-up and blur after 7 seconds
  timeoutId = setTimeout(() => {
    hideGreetingPopup();
  }, 5000); // 7000 milliseconds = 7 seconds
}

$(document).ready(function () {
  // Add a click event listener to the button
  $("#downloadPdfButton").on("click", function () {
    // Check if the form is valid
    const isValidForm = validateForm();

    if (isValidForm) {
      var PDF_Width = 595.28;
      var PDF_Height = 841.89;
      // Rest of the PDF generation code as before
      // ...
    } else {
      // If the form is not valid, prevent the PDF generation and show an error message
      return;
    }
  });

  function validateForm() {
    // Get the form elements
    var quotationToInput = document.getElementById("quotationToInput");
    var quotationNumberInput = document.getElementById("quotationNumberInput");
    var quotationTotalInput = document.getElementById("quotationTotalInput");

    // Get the error message div
    var errorMessage = document.getElementById("error-message");

    // Check if the required fields are filled
    if (
      !quotationToInput.value.trim() ||
      !quotationNumberInput.value.trim() ||
      !quotationTotalInput.value.trim()
    ) {
      errorMessage.textContent = "Please fill in all the required fields.";
      return false;
    }

    // If the form is valid, clear any previous error messages and return true
    errorMessage.textContent = "";
    return true;
  }
});
