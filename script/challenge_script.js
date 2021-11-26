function setThumbnail(event) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = document.createElement("img");
    img.id = "file";
    img.setAttribute("src", event.target.result);
    $("#file").replaceWith(img);
    // console.log(img);
    // document
    //   .querySelector("#file")
    //   .replaceWith("<div id=file>" + img + "</div>");
  };
  reader.readAsDataURL(event.target.files[0]);
}

function printResult() {
  const input = document.getElementById("input").value;
  document.getElementById("result").innerText = input;
}
