/////////////////////////////////////////*******Variables Declaration*******//////////////////////////////////

//Setting 100% width for Mobile browsers
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

//Fetching data from local storage
let bills = JSON.parse(localStorage.getItem("bills")) ?? [];

//Global Variable Declaration
let form_bill_name = null;
let print_input = null;
let temp_bill = null;
let row_count = 0;
let active_rows = [];
let active_row_types = [];
let formfield_notfilled = false;
let del_bill = null;

//Service Options List
const service_options = [
  "Service Charges",
  "Capacitor",
  "Standard Installation",
  "Dismantilling A/C Unit",
  "Gas Charging",
  "Gas top up",
  "Indoor blower",
  "Indoor Fan Motor",
  "Indoor PCB 1 TR",
  "L Type Stand",
  "Outdoor Fan Blade",
  "Sensor",
  "Flare nut",
  "Compressor",
  "Remote",
  "Timer",
  "Strainer replacement",
  "Contactor Relay",
  "Condensor Coil",
  "Air Filter",
  "Capillary",
  "MCB",
  "Indoor Unit",
  "Outdoor Unit",
  "Voltage Stabiliser(4 KVA)",
  "Louver Motor",
  "Display PCB",
  "Main Control Board PCB",
];

//Items List
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//Json for Template
const template_Json = {
  body: {
    heading: "Heading",
    subHeading: "Subheading",
    date: "yyyy-mm-dd",
    address: "Address",
    phonenumber1: "Phonenum1",
    phonenumber2: "Phonenum2",
    total: 3000,
    rows: [
      {
        service: "Item1",
        items: "1",
        amount: "100",
      },
      {
        service: "Item2",
        items: "2",
        amount: "200",
      },
      {
        service: "Item3",
        items: "3",
        amount: "300",
      },
      {
        service: "Item4",
        items: "4",
        amount: "400",
      },
    ],
  },
};

//Declaring the Template Styles

const style1 = `  <style>

 body{
  margin: 5vh;
  font-family: "Noto Sans", sans-serif;
  -webkit-print-color-adjust: exact !important;
}

/* header {
  border-bottom: 2px solid black;
} */

h1 {
  text-align: center;
}

.sub-heading {
  text-align: center;
}

.heading-info {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.heading-info > div {
  background-color: #f7faff;
  padding: 5px 10px;
  border-radius: 10px;
}

.phonenumbers {
  width: 15vw;
  text-align: center;
}

table,
th,
td {
  border: none;
  padding: 15px;
  text-align: left;
}

table {
  width: 100%;
  padding: 1vh 0;
  background-color: #f7faff;
  border-radius: 10px;
  margin-top: 35px;
}

.row-header {
  background-color: #733dd9;
  color: #fff;
}

.col-1 {
  width: 50%;
}
.col-2 {
  width: 25%;
}
.col-3 {
  width: 25%;
}
.total {
  /* border-top: 2px solid black; */
  font-weight: 1000;
  font-size: 20px;
  margin-top: 25px;
}
.total-in-words {
  width: 100%;
  font-weight: 600;
  text-align: right;
  font-style: italic;
}
.row-heading{
  font-weight: 600;
  font-size: 18px;
}
</style>`;

const style2 = `<style>
body {
  margin: 5vh;
  font-family: "Noto Sans", sans-serif;
}

header {
  border-bottom: 2px solid black;
}

h1 {
  text-align: center;
}

.sub-heading {
  text-align: center;
}

.heading-info {
  display: flex;
  justify-content: space-between;
}

th, table {
  /* border: 1px solid black; */
  border: none;
  padding: 15px;
  text-align: left;
}

td {
  /* border: 1px solid black; */
  border: none;
  padding: 15px;
  text-align: left;
}

table {
  width: 100%;
  padding: 1vh 0;
}

.col-1 {
  width: 50%;
}
.col-2 {
  width: 25%;
}
.col-3 {
  width: 25%;
  text-align: right;
}
.total {
  border-top: 2px solid black;
  font-weight: 8 00;
  font-size: 20px;
  margin-top: 35px;
}
.total-in-words {
  width: 100%;
  font-weight: 600;
  text-align: right;
  font-style: italic;
}
.row-heading{
  font-weight: 600;
  font-size: 18px;
}
</style>
`;

const styles = [style1, style2, style1];

//Save function Json Flag
const save_function_flag = {
  edit_request: false,
  edit_value: null,
};

const transparent_div = document.createElement("div");
transparent_div.setAttribute("class", "transparent");

//Selecting Right,Left,Main,push text Elements for app naviation
const right_icon = document.querySelector(".footer-right-icon");
const left_icon = document.querySelector(".footer-left-icon");
const main = document.querySelector(".main");
const push_text = document.querySelector(".push_text");

/////////////////////////////////////////*******Left Tab UI Elements*******//////////////////////////////////

//div
const left_tab_div = document.createElement("div");
left_tab_div.setAttribute("class", "left-tab tab");

// No bill found img html
const no_data_html = `<div class="nodata">
<img src="/icons/No-Data-Found.jpg" alt="" />
<p class="fontcolor-light">No Bills Found</p>
</div>`;

//Create Bill button html
const create_bill_button_html = `<div class="create_bill" onclick="create_bill_function()"><p>Create Bill</p></div>`;

//Logic - Fires whenever user select the Footer left icon
function left_tab() {
  console.log("Inside left tab function");

  while (left_tab_div.firstChild) {
    left_tab_div.removeChild(left_tab_div.lastChild);
  }

  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }

  if (right_icon.classList.contains("footer-active-tab")) {
    right_icon.classList.remove("footer-active-tab");
  }
  if (!left_icon.classList.contains("footer-active-tab")) {
    left_icon.classList.add("footer-active-tab");
  }

  //Action -1 - Checking local storage for existing bills json
  const bills_retrived = JSON.parse(localStorage.getItem("bills"));
  console.log(`bills- ${bills_retrived}`);

  if (bills_retrived) {
    //Bills found - Converting retrived JSON  bills into UI elements
    bills_retrived.forEach((element, i) => {
      const temp = document.createElement("div");
      temp.setAttribute("class", `bills bill-${i}`);
      temp.innerHTML = `<div class="bill-row-1">
      <img
        class="bill_icon bill_icon_color_${(i + 1) % 4}"
        src="/icons/bill-${(i + 1) % 4}.png"
        alt=""
      />
      <div class="bill_name">
        <div class="bill_name_heading">${element.header.name}</div>
        <div class="bill_name_subheading">${element.header.dateCreated}</div>
      </div>
    </div>
    <div class="bill-row-2">
      <button class="${i}" onclick="edit(this)">Edit</button>
      <button class="${i}" onclick="choose_template_function(this)">Print</button>
      <button class="${i} bill-delete">Delete</button>
    </div>`;
      left_tab_div.appendChild(temp);
    });
  } else {
    //No bills found - Adding No found image to the left tab
    left_tab_div.insertAdjacentHTML("beforeend", no_data_html);
  }

  //Adding create bill button
  left_tab_div.insertAdjacentHTML("beforeend", create_bill_button_html);
  main.appendChild(left_tab_div);
}

/////////////////////////////////////////*******Right Tab UI Elements*******//////////////////////////////////

//div
const right_tab_div = document.createElement("div");
right_tab_div.setAttribute("class", "right-tab tab");

//html
const right_tab_inner_html = `<div class="box template-1"><p>Template1</p></div>
<div class="box template-2"><p>Template2</p></div>
<div class="box template-3"><p>Template3</p></div>`;

right_tab_div.innerHTML = right_tab_inner_html;

//Logic - Fires whenever user select the Footer right icon
function right_tab() {
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }
  if (left_icon.classList.contains("footer-active-tab")) {
    left_icon.classList.remove("footer-active-tab");
  }
  if (!right_icon.classList.contains("footer-active-tab")) {
    right_icon.classList.add("footer-active-tab");
  }
  main.appendChild(right_tab_div);
}

//Templates will be displayed when ever used selects any Template boxes
const template_img_div = document.createElement("div");
template_img_div.setAttribute("class", "template-img-box");

//Tempplates Logic
main.addEventListener("click", (e) => {
  if (e.target.classList.contains("box")) {
    const template_no = e.target.classList[1].substring(9);
    template_img_div.innerHTML = `<img class="template_close_icon" onclick="close_template()" src="/icons/close.png" alt="" />`;
    main.appendChild(template_img_div);
    const printReady = template(template_Json, template_no);
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    template_img_div.appendChild(iframe);
    const pri = iframe.contentWindow;
    pri.document.open();
    pri.document.write(printReady);
    pri.document.body.style.fontSize = "10px";
    pri.document.querySelector(".total").style.fontSize = "14px";
    pri.document.querySelector(".heading").style.fontSize = "18px";
    pri.document.close();
  }
});

//Function to close the Selected Template
function close_template() {
  template_img_div.remove();
}

//Event listners for left and Right tab
left_icon.addEventListener("click", left_tab);
right_icon.addEventListener("click", right_tab);

////////////////////////Logic to handle the Exposed events- Create bill, Edit, Print, Delete /////////////////////////////////////

/*
1.Create bill ==calls==> create_bill_function() 
--------------  [Create_bill adds the UI pop-up to enter the bill name, which exposes two events - Cancel & Create]--------------
                                   i. Cancel  ==calls==> close_pop_up()
                                   ii.Create  ==calls==> create_pop_up()  
--[Create_pop_up adds the form UI to enter bill details, which exposes events- Save, Heading, Create row, Delete rows & Close]---
                                                             a. Save        ==calls==> save_function()
        --  [Save adds the dailouge box to the UI, which exposes two events - Cancel & Save]--- 
                                                                                A.Cancel ==calls==> save_cancel_form_pop_up()
                                                                                B.Save   ==calls==> bill_save_function()
                                                             b. Heading     ==calls==> row_heading()
                                                             c. Create Row  ==calls==> row_function()
                                                             d. Delete Rows
                                                             e. Close       ==calls==> discard_popup_function()
          --  [Close img adds the dailouge box to the UI, which exposes two events - Cancel & Discard]--- 
                                                                                A.Cancel ==calls==> close_form_pop_up()
                                                                                B.Save   ==calls==> close_function()
*/

//div
const create_pop_up_div = document.createElement("div");
create_pop_up_div.setAttribute("class", "create-bill-pop-up");

//html
const create_pop_up_html = `<p>New Bill Name</p>
<input
  type="text"
  id="bill-pop-up"
  value="Untitled"
  name="bill-pop-up"
/><br /><br />
  <div class="create-pop-up-button">
  <button onclick="close_pop_up()">Cancel</button>
  <button onclick="create_pop_up()">Create</button>
  </div>`;

create_pop_up_div.innerHTML = create_pop_up_html;

//*****(1)*****Function will be fired as a onclick event when user selects create bill button
function create_bill_function() {
  document.body.appendChild(transparent_div);
  main.appendChild(create_pop_up_div);
}

//***(1.i)***Closes the create bill pop up
function close_pop_up() {
  document.getElementById("bill-pop-up").value = "Untitled";
  fieldsValidation("bill-pop-up");
  create_pop_up_div.remove();
  transparent_div.remove();
}

const form_div = document.createElement("div");
form_div.setAttribute("class", "popup-body");

//Creates form html *** called by the create_pop_up() function ***, exposes three events - save, create row, row heading

const form_child = (bill_name) => {
  return `<div class="pop-up">
<p class="form-bill-name">${bill_name}</p>
<img class="close_icon" onclick="discard_popup_function()" src="/icons/close.png" alt="" />
<div class="form">
  <form action="">
    <label for="heading">Heading</label>
    <input type="text" id="heading" value="Puppala Venkata RamaRao" name="heading" /><br /><br />
    <label for="sub_heading">Sub Heading</label>
    <input type="text" id="sub_heading" value="Air Conditioning and Refrigeration Works" name="sub_heading" /><br /><br />
    <label for="address">Address</label>
    <input type="text" id="address" value="Dr.150 Hudco Colony,Balaga, Srikakulam - 532001" name="Address" /><br /><br />
    <label for="date">Date</label>
    <input type="date" id="date" format="dd/mm/yyyy" name="date" /><br /><br />
    <label for="phoneno_1">Phone Number</label>
    <input type="tel" id="phoneno_1" value="9010524234" placeholder="Enter phone number" /><br /><br />
    <label for="phoneno_2">Phone Number2</label>
    <input type="tel" id="phoneno_2" value="7674897234" placeholder="Enter phone number" /><br /><br />
  </form>
</div>
</div>
<div class="popup_footer">
<button class="popup_button" onclick="save_function()"><p>Save</p></button>
<button class="popup_button" onclick="row_heading()"><p>Row Heading</p></button>
<button class="add_row popup_button disable-select" onclick="row_function()"><p>Create Row</p></button>
</div> `;
};

//***(1.ii)***Adds form to the UI, by calling the form_child function
function create_pop_up() {
  form_bill_name = fieldsValidation("bill-pop-up");
  if (form_bill_name) {
    create_pop_up_div.remove();
    form_div.innerHTML = form_child(form_bill_name);
    main.appendChild(form_div);
    document.getElementById("date").valueAsDate = new Date(Date.now());
  } else {
    push("Please fill bill name", "#ff0000");
  }
}

//creating datalist elements for form rows

const service_datalist = document.createElement("datalist");
service_datalist.id = "services";
service_options.forEach((v, i) => {
  const service_options_element = document.createElement("option");
  service_options_element.value = v;
  service_datalist.appendChild(service_options_element);
});

const items_datalist = document.createElement("datalist");
items_datalist.id = "items";
items.forEach((v, i) => {
  const items_options_element = document.createElement("option");
  items_options_element.value = v;
  items_datalist.appendChild(items_options_element);
});

//row html function creates the row element in the form *** called by row_function() ***
function row_html(row) {
  const table_row_div = document.createElement("div");
  table_row_div.className = `table_row row-${row}`;

  //Service Datalist
  const input_service_ele = document.createElement("input");
  input_service_ele.setAttribute("list", "services");
  input_service_ele.id = `service-${row}`;
  input_service_ele.name = "services";
  input_service_ele.className = "services";
  input_service_ele.placeholder = "Select Service";
  input_service_ele.appendChild(service_datalist);
  table_row_div.appendChild(input_service_ele);

  //Item datalist
  const input_items_ele = document.createElement("input");
  input_items_ele.setAttribute("list", "items");
  input_items_ele.id = `items-${row}`;
  input_items_ele.name = "items";
  input_items_ele.className = "items";
  input_items_ele.placeholder = "Items";
  input_items_ele.appendChild(items_datalist);
  table_row_div.appendChild(input_items_ele);

  //Amount Input
  const input_amount_ele = document.createElement("input");
  input_amount_ele.type = "number";
  input_amount_ele.class = "amount";
  input_amount_ele.placeholder = "Amount";
  input_amount_ele.id = `amount-${row}`;
  input_amount_ele.name = "amount";
  input_amount_ele.className = "amount";
  table_row_div.appendChild(input_amount_ele);

  //Del icon
  const delete_div = document.createElement("div");
  const delete_img = document.createElement("img");
  delete_img.className = `del-icon del-icon-${row}`;
  delete_img.src = "/icons/delete.png";
  delete_div.appendChild(delete_img);
  table_row_div.appendChild(delete_div);

  const form = document.querySelector(".form");

  form.appendChild(table_row_div);
}

//*(1.ii.b)*
function row_heading_html(row) {
  const table_row_heading_div = document.createElement("div");
  table_row_heading_div.className = `table_row row-${row} table_row_heading`;

  //Heading Input
  const input_row_heading_ele = document.createElement("input");
  input_row_heading_ele.type = "text";
  input_row_heading_ele.class = "row-heading";
  input_row_heading_ele.placeholder = "Row Heading";
  input_row_heading_ele.id = `heading-${row}`;
  input_row_heading_ele.name = "row-heading";
  input_row_heading_ele.className = "row-heading";
  table_row_heading_div.appendChild(input_row_heading_ele);

  const delete_div = document.createElement("div");
  const delete_img = document.createElement("img");
  delete_img.className = `del-icon del-icon-${row}`;
  delete_img.src = "/icons/delete.png";
  delete_div.appendChild(delete_img);
  table_row_heading_div.appendChild(delete_div);

  const form = document.querySelector(".form");

  form.appendChild(table_row_heading_div);
}

function row_heading() {
  let row_heading_flag = false;
  if (row_count === 0) {
    row_heading_flag = true;
  }

  if (row_count > 0) {
    if (!formValidation().status && active_row_types[row_count - 1] !== "H") {
      row_heading_flag = true;
    }
  }
  console.log(row_heading_flag);
  if (row_heading_flag) {
    row_heading_html(row_count);
    active_rows.push(row_count);
    active_row_types.push("H");
    row_count++;
    console.log(active_rows, active_row_types);
  } else {
    push("Can't add two headings", "#ff0000");
  }
}

//*(1.ii.c)* Adds row to the form by calling row_html function
function row_function() {
  if (!formValidation().status) {
    row_html(row_count);
    active_rows.push(row_count);
    active_row_types.push("R");
    row_count++;
  } else {
    push("Fill all the details", "#ff0000");
  }

  console.log(active_rows, active_row_types);
}

//*(1.ii.d)*Del Row logic
main.addEventListener("click", (e) => {
  if (e.target.classList.contains("del-icon")) {
    const row_no = e.target.classList[1].substring(9);
    console.log(`row-${row_no}`);
    const myobj = document.querySelector(`.row-${row_no}`);
    console.log(myobj);
    myobj.remove();
    const removed_index = active_rows.indexOf(Number(row_no));
    console.log(`removed index- ${removed_index}`);
    active_rows.splice(removed_index, 1);
    active_row_types.splice(removed_index, 1);
    console.log(active_rows, active_row_types);
    row_count--;
  }
});

//Save logic

const save_form_pop_up_html = `<p class="close_form-pop-up-heading">Name</p>
<p class="close_form-pop-up-sub-heading">Are you sure you want to save your changes?</p>
  <div class="close-form-pop-up-button">
  <button onclick="save_cancel_form_pop_up()">Cancel</button>
  <button class="close-form-discard-button" onclick="bill_save_function()">Save</button>
  </div>`;

const save_form_pop_up_div = document.createElement("div");
save_form_pop_up_div.setAttribute("class", "close_form-pop-up");
save_form_pop_up_div.innerHTML = save_form_pop_up_html;

//*(1.ii.a.A)*Closes Save popup dailogue box
function save_cancel_form_pop_up() {
  save_form_pop_up_div.remove();
  transparent_div.style.zIndex = 6;
}

//*(1.ii.a)**Save Bill logic - validates the field and calls save_popup_function()*** called by onclick event of Save function***

function formValidation() {
  formfield_notfilled = false;

  let body = {};
  body.heading = fieldsValidation(`heading`);
  body.subHeading = fieldsValidation(`sub_heading`);
  body.address = fieldsValidation(`address`);
  body.date = fieldsValidation(`date`);
  body.phonenumber1 = fieldsValidation(`phoneno_1`);
  body.phonenumber2 = fieldsValidation(`phoneno_2`);

  let rows = [];
  let total = 0;
  active_rows.forEach((i, n) => {
    let rows_json = {};

    if (active_row_types[n] === "H") {
      rows_json.heading = fieldsValidation(`heading-${i}`);
    } else {
      rows_json.service = fieldsValidation(`service-${i}`);
      rows_json.items = fieldsValidation(`items-${i}`);
      rows_json.amount = fieldsValidation(`amount-${i}`);
      total = total + Number(rows_json.items) * Number(rows_json.amount);
    }

    rows.push(rows_json);
  });

  body.rows = rows;
  body.total = total;

  return { form: body, status: formfield_notfilled };
}

function save_function() {
  const tempvar = formValidation();
  if (tempvar.status) {
    push("Please fill details", "#ff0000");
  } else if (row_count === 0) {
    push("Please add any row", "#ff0000");
  } else {
    temp_bill = tempvar.form;
    main.appendChild(save_form_pop_up_div);
    transparent_div.style.zIndex = 14;
  }
}

//*(1.ii.a.B)*Saves the bill to the local storage *** called by onclick event of Save button from dailogue boxs
function bill_save_function() {
  temp = {};
  let header = {};
  header.id = Date.now();
  header.name = save_function_flag.edit_request
    ? bills[save_function_flag.edit_value].header.name
    : form_bill_name;
  header.dateCreated = current_date();
  temp.body = temp_bill;
  temp.header = header;

  if (!save_function_flag.edit_request) {
    bills.push(temp);
    localStorage.setItem("bills", JSON.stringify(bills));
  } else {
    bills[save_function_flag.edit_value] = temp;
    localStorage.setItem("bills", JSON.stringify(bills));
  }
  push("bill saved", "#000000");
  close_function();
  left_tab();
}

//Close Logic

const close_form_pop_up_html = `<p class="close_form-pop-up-heading">Unsaved Changes</p>
<p class="close_form-pop-up-sub-heading">Are you sure you want to discard the bill. Your changes will be lost</p>
  <div class="close-form-pop-up-button">
  <button onclick="close_form_pop_up()">Cancel</button>
  <button class="close-form-discard-button" onclick="close_function()">Discard</button>
  </div>`;

const close_form_pop_up_div = document.createElement("div");
close_form_pop_up_div.setAttribute("class", "close_form-pop-up");
close_form_pop_up_div.innerHTML = close_form_pop_up_html;

//****(1.ii.e)****Adds the dailogue box to the UI - which exposes two events - Cancel & Discard
function discard_popup_function() {
  main.appendChild(close_form_pop_up_div);
  transparent_div.style.zIndex = 14;
}

//**(1.ii.e.A)** Cancel the dailogue box
function close_form_pop_up() {
  close_form_pop_up_div.remove();
  transparent_div.style.zIndex = 6;
}

//**(1.ii.e.B)** Discards the working bill
function close_function() {
  form_div.remove();
  transparent_div.style.zIndex = 6;
  transparent_div.remove();
  close_form_pop_up_div.remove();
  row_count = 0;
  active_rows = [];
  active_row_types = [];
  save_function_flag.edit_request = false;
  save_function_flag.edit_value = null;
  temp_bill = null;
}

/*
2.Edit ==calls==> edit() 
Adds the form UI and set the values retrieved from JSON
*/
function edit(e) {
  active_row_types = [];
  save_function_flag.edit_request = true;
  save_function_flag.edit_value = e.classList.value;

  const tempeditBill = bills[e.classList.value];
  row_count = tempeditBill.body.rows.length;
  document.body.appendChild(transparent_div);
  form_div.innerHTML = form_child(tempeditBill.header.name);
  main.appendChild(form_div);

  document.getElementById(`heading`).value = tempeditBill.body.heading;
  document.getElementById(`sub_heading`).value = tempeditBill.body.subHeading;
  document.getElementById(`date`).value = tempeditBill.body.date;
  document.getElementById(`address`).value = tempeditBill.body.address;
  document.getElementById(`phoneno_1`).value = tempeditBill.body.phonenumber1;
  document.getElementById(`phoneno_2`).value = tempeditBill.body.phonenumber2;
  tempeditBill.body.rows.map((x, i) => {
    if (Object.keys(x).length === 1) {
      row_heading_html(i);
      document.getElementById(`heading-${i}`).value = x.heading;
      active_row_types.push("H");
      active_rows.push(i);
    } else {
      row_html(i);
      document.getElementById(`service-${i}`).value = x.service;
      document.getElementById(`items-${i}`).value = x.items;
      document.getElementById(`amount-${i}`).value = x.amount;
      active_row_types.push("R");
      active_rows.push(i);
    }
  });
}

/*3.Print => choose_template_function() - Adds Template UI - which exposes two events
                                     i.Cancel => close_template_pop_up()
                                    ii.Print  => print()
*/

const choose_template_html = `<p>Choose Template</p>
<select name="template" id="template">
  <option value="1">Template 1</option>
  <option value="2">Template 2</option>
  <option value="3">Template 3</option>
</select><br /><br />
  <div class="template-pop-up-button">
  <button onclick="close_template_pop_up()">Cancel</button>
  <button onclick="print()">Print</button>
  </div>`;

const template_pop_up_div = document.createElement("div");
template_pop_up_div.setAttribute("class", "template-bill-pop-up");
template_pop_up_div.innerHTML = choose_template_html;

//****(3)***Adds dialogue box to the UI to select the template
function choose_template_function(e) {
  document.body.appendChild(transparent_div);
  main.appendChild(template_pop_up_div);
  print_input = e.classList.value;
}

//****(3.i)*****
function close_template_pop_up() {
  template_pop_up_div.remove();
  transparent_div.remove();
}

//Function to build the rows in the template*****Called by Template function
const build_rows = (rows) => {
  let row_str = `<tr class="row-header">
  <th class="col-1">Service</th>
  <th class="col-2">Items</th>
  <th class="col-3">Price</th>
</tr>`;
  rows.forEach((x) => {
    if (Object.keys(x).length === 1) {
      row_str =
        row_str +
        `<tr>
    <td class="col-1 row-heading">${x.heading}</td>
    <td class="col-2"></td>
    <td class="col-3"></td>
    </tr>`;
    } else {
      row_str =
        row_str +
        `<tr>
    <td class="col-1">${x.service}</td>
    <td class="col-2">${x.items}</td>
    <td class="col-3">${x.amount}/-</td>
    </tr>`;
    }
  });
  return row_str;
};

//Function to build the Template****Called by the Print Function***

const template = (bill, style_selected) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0" /> -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
    <title>Template1</title>
  </head>
  ${styles[style_selected - 1]}
  <body>
    <header>
      <h1 class="heading">${bill.body.heading}</h1>
      <div class="sub-heading">
        <p>${bill.body.subHeading}</p>
      </div>
      <div class="heading-info">
        <div class="phonenumbers">
          <p>${bill.body.phonenumber1}</p>
          <p>${bill.body.phonenumber2}</p>
        </div>
        <div class="address">
          <p>${bill.body.address}</p>
          <p>${date_format(bill.body.date)}</p>
        </div>
      </div>
    </header>
    <main>
      <table>
        ${build_rows(bill.body.rows)}
      </table>
    </main>
    <div class="total">
    <table>
      <tr>
        <td class="col-1">Total</td>
        <td class="col-2"></td>
        <td class="col-3">${bill.body.total}/-</td>
      </tr>
    </table>
    <p class="total-in-words">
    ${inWords(Number(bill.body.total))}
    </p>
  </div>
  </body>
</html>
`;
};

//*****(3.ii)****Function to print the Template****Called by the Print button onclick event from dialogue box***//

function print() {
  const selected_template = document.getElementById("template").value;
  const printReady = template(bills[print_input], selected_template);
  document.title = bills[print_input].header.name.pdf;
  console.log(printReady);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  const pri = iframe.contentWindow;
  pri.document.open();
  pri.document.write(printReady);
  pri.document.close();
  console.log(pri.document);
  pri.focus();
  pri.print();
  close_template_pop_up();
  document.title = "Bill Generator";
  pri.onafterprint = () => {
    console.log("after print");
    document.title = "Bill Generator";
  };
}

/*4.Delete => bill_delete_popup_UI() - Adds Template UI - which exposes two events
                                     i.Cancel => close_bill_pop_up()
                                    ii.Sure  => bill_delete_function()
*/

const delete_bill_pop_up_html = `<p class="close_form-pop-up-heading">Delete</p>
<p class="close_form-pop-up-sub-heading">Are you sure you want to delete the bill</p>
  <div class="close-form-pop-up-button">
  <button onclick="close_bill_pop_up()">Cancel</button>
  <button onclick="bill_delete_function()">Sure</button>
  </div>`;

const delete_bill_pop_up_div = document.createElement("div");
delete_bill_pop_up_div.setAttribute("class", "close_form-pop-up");
delete_bill_pop_up_div.innerHTML = delete_bill_pop_up_html;

//****Adds the dailogue box to the UI - which exposes two events - Cancel & Sure
function bill_delete_popup_UI() {
  main.appendChild(delete_bill_pop_up_div);
  document.body.appendChild(transparent_div);
}

//***(4.i)** Cancel the dailogue box
function close_bill_pop_up() {
  delete_bill_pop_up_div.remove();
  transparent_div.remove();
}

//***(4.ii)** deletes the bill from local storage
function bill_delete_function() {
  bills.splice(del_bill, 1);

  if (bills.length === 0) {
    localStorage.removeItem("bills");
  } else {
    localStorage.setItem("bills", JSON.stringify(bills));
  }
  delete_bill_pop_up_div.remove();
  transparent_div.remove();
  left_tab();
  push("Bill deleted", "#ff0000");
  del_bill = null;
}
main.addEventListener("click", (e) => {
  if (e.target.classList.contains("bill-delete")) {
    bill_delete_popup_UI();
    del_bill = e.target.classList[0];
    console.log(`${del_bill}`);
  }
});

///////////////////////////////////**************Helper Functions*****************//////////////////////////

//**Current date logic
function current_date() {
  const today = new Date(Date.now());
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

//**Date Format logic
function date_format(date) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

///**Total in Words Logic
const a = [
  "",
  "One ",
  "Two ",
  "Three ",
  "Four ",
  "Five ",
  "Six ",
  "Seven ",
  "Eight ",
  "Nine ",
  "Ten ",
  "Eleven ",
  "Twelve ",
  "Thirteen ",
  "Fourteen ",
  "Fifteen ",
  "Sixteen ",
  "Seventeen ",
  "Eighteen ",
  "Nineteen ",
];
const b = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function inWords(num) {
  if ((num = num.toString()).length > 9) return "overflow";
  n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str + "Rupees Only";
}

///Fields Validation

function fieldsValidation(str) {
  const ele = document.getElementById(str);
  if (ele.value) {
    if (ele.classList.contains("null-border")) {
      ele.classList.remove("null-border");
    }
  } else {
    formfield_notfilled = true;
    ele.classList.add("null-border");
  }
  return ele.value;
}

//**Push notification
function push(text, color) {
  push_text.textContent = text;
  push_text.style.color = color;
  push_text.style.top = "3vh";
  setTimeout(() => {
    push_text.style.top = "-10vh";
  }, 1250);
}

///// Code flow Starts Here /////////////
left_tab();

const aaa = {
  heading: "hello",
  service: "item",
};

console.log(Object.keys(aaa).length);
