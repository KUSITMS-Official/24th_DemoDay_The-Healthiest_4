function draw(count, bImage_upload) {
  console.log(count);
  for (let index = 0; index < count; index++) {
    var stamp = document.createElement("img");
    var i;
    i = index + 1;
    stamp.id = "stamp-" + i.toString();
    stamp.src = "../img/stamp.png";
    console.log(i.toString());
    $("#stamp-" + i.toString()).replaceWith(stamp);
    console.log("#stamp-" + i.toString());
  }

  if (bImage_upload) {
    $("#fail").modal("show");
  }
}

function changeContent(certification) {
  var content = document.createElement("div");
  content.id = content;
  if (certification.equals("non-date"))
    content.innerText = "해당 날짜가 제대로 제시되지 않았습니다.";
  else if (certification.equals("same-image"))
    content.innerText = "동일 사진으로 판명되었습니다";

  $("#content").replaceWith(content);
}
