document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

//FIXED SCROLL NAV BAR WITH TRANSITION
// $(document).ready(function() {

//   $(window).scroll(function() {

//       var height = $('header').height();
//       var scrollTop = $(window).scrollTop();

//       if (scrollTop >= height - 60) {
//           $('.navcontainer').addClass('solid-nav');
//       } else {
//           $('.navcontainer').removeClass('solid-nav');
//       }

//   });
// });

function showImage() {
  var img = document.getElementById('showpost-img1');
  var img2 = document.getElementById('showpost-img2');
  if( img.style.visibility == 'visible') {
    img.style.visibility = 'hidden';
    img.style.display = 'none';
    img2.style.visibility = 'visible';
    img2.style.display  = 'block';
} else {
    img.style.visibility = 'visible';
    img.style.display = 'block';
    img2.style.visibility = 'hidden';
    img2.style.display = 'none';
}

}


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}


// $(document).ready(function () {
// 	$('#choose-file').change(function () {
// 		var i = $(this).prev('label').clone();
//     var file = $('#choose-file')[0].files[0].name;
//     $(this).prev('label').text(file);
   

//   }); 

//  });


function updateList() {
  var input = document.getElementById('file');
  var output = document.getElementById('fileList');

  output.innerHTML = '<ul>';
  for (var i = 0; i < input.files.length; ++i) {
    output.innerHTML += '<li>' + input.files.item(i).name + '</li>';
  }
  output.innerHTML += '</ul>';
}

// $(document).ready(function() {
//   $('.carousel .carousel-caption').css('zoom', $('.carousel').width()/1250);
// });

// $(window).resize(function() {
//   $('.carousel .carousel-caption').css('zoom', $('.carousel').width()/1250);
// });