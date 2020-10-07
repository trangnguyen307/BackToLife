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