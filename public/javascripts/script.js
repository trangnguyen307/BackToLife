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

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
