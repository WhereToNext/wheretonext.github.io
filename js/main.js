// inner variables
var song;
var tracker = $('#tracker');
var volume = $('.volume');

function initAudio(elem) {
	var url = elem.attr('audiourl');
	var title = elem.text();
	var artist = elem.attr('artist');

	$('#song-title').text(title);

	song = new Audio('songs/' + url);

	// timeupdate event listener
	song.addEventListener('timeupdate',function (){
		var curtime = parseInt(song.currentTime, 10);
		tracker.slider('value', curtime);
	});

	$('.playlist li').removeClass('active');
	elem.addClass('active');
}

function playAudio() {
	song.play();

	tracker.slider("option", "max", song.duration);

	$('.fa-play').addClass('hidden');
	$('.fa-pause').removeClass('hidden');
}
function stopAudio() {
	song.pause();

	$('.fa-play').removeClass('hidden');
	$('.fa-pause').addClass('hidden');
}

$(document).ready(function() {

	// Get the current page and append a html, utilised to allow hash linking
	currentPage = window.location.hash.substr(1, (window.location.hash.length-1)) + ".html";
	// Make sure the page actually exists
	if (currentPage.length > 5) {
		// Make the content box unhidden
		$("#content").removeClass("hidden");
		// Load the page and check if an error occurred
		$("#content").load(currentPage, {limit: 25}, function(response, status, req) {
			// If an error occurred, just display the home page
			if (status == "error") {
				// Empy the content block and make the content box hidden
				$("#content").empty();
				$("#content").addClass("hidden");
				// Set up the background image as the home page
				$("body").removeAttr("id");
				// Reset the hash to home page
				window.location.hash = "";
				$("body").attr("id", "home");
				// Iterate over the links and make the home page active
				$(".links").each(function() {
					if ($(this).attr("href") == "index") {
						$(this).addClass("active");
					}
					else
					{
						$(this).removeClass("active");
					}
				});
			}
			else if (status == "success")
			{
				// If successful load the content for the page
				$("body").removeAttr("id");
				$("body").attr("id", window.location.hash.substr(1, (window.location.hash.length-1)));
				$(".links").each(function() {
					if ($(this).attr("href") == currentPage) {
						$(this).addClass("active");
					}
					else
					{
						$(this).removeClass("active");
					}
				});
			}
		});
	}

	// When a link is clicked, show the page
	$(".links").click(function(e) {
		if ($(this).attr("href").substring($(this).attr("href").length-4, $(this).attr("href").length) === "html") {
			// Make sure the links don't redirect
			e.preventDefault();
			var pageURL = $(this).attr("href");
			// Set the active page in the navigation bar
			element = $("a.active");
			element.removeClass("active");
			$(this).addClass("active");
			// If it's the home page, remove everything and show the home page background image
			if (pageURL == 'index.html') {
				$("#content").fadeOut("slow");
				$("body").removeAttr("id");
				$("body").attr("id", "home");
				window.location.hash = "";
			}
			else {
				var currentPage = pageURL.substr(0, (pageURL.length-5));
				if ($("#content").hasClass("hidden")) {
					$("#content").load(pageURL);
					$("#content").fadeIn("slow");
				}
				else
				{
					$("#content").fadeOut(function() {
						$("#content").load(pageURL);
						$("#content").fadeIn("slow");
					});
				}
				$("body").removeAttr("id");
				$("body").attr("id", currentPage);
				window.location.hash = currentPage;
			}
		}
	});

	/*
		Lazaris, Louis. 2015. 'Animating From “Display: Block” To “Display: None” | Impressive Webs'. Impressivewebs.Com. http://www.impressivewebs.com/animate-display-block-none/.
	*/

	var objSidebar = $('#sidebar');

	function hideSidebar() {
		// Remove the sidebar and change the arrow
		$("#close-text .fa").removeClass("fa-arrow-left");
		$("#close-text .fa").addClass("fa-arrow-right");
		objSidebar.removeClass('sidebar');
		objSidebar.addClass('sidebar-closed');
	}

	function showSidebar() {
		// Show the sidebar and change the arrow
		$("#close-text .fa").removeClass("fa-arrow-right");
		$("#close-text .fa").addClass("fa-arrow-left");
		objSidebar.removeClass('sidebar-closed');
		objSidebar.addClass('sidebar');
	}

	$('#close').click(function() {
		// Animate the sidebar close and open
		if ($('#sidebar').hasClass('sidebar-closed')) {
			var content_left = $("#sidebar").width()+21 + "px"
			$('#content').animate({
				left: content_left
			}, 1000, function() {});
			$('#sidebar').animate({
				left: "20px"
			}, 1000, function() {
				showSidebar();
			})
		}
		else
		{
    		$('#content').css("position","absolute");
    		var left_px = ( $(window).width() - $('#content').width() ) / 2+$(window).scrollLeft() + "px";
			$('#content').animate({
				left: left_px
			}, 1000, function () {});
			$('#sidebar').animate({
				left: "-20%"
			}, 1000, function() {
				hideSidebar();
			})
		}
	});

/*
	Script Tutorials,. 2013. 'HTML5 Audio Player With Playlist'. http://www.script-tutorials.com/html5-audio-player-with-playlist/.
*/

	// play click
	$('.fa-play').click(function (e) {
		e.preventDefault();

		playAudio();
	});

	// pause click
	$('.fa-pause').click(function (e) {
		e.preventDefault();

		stopAudio();
	});

	// forward click
	$('.fa-forward').click(function (e) {
		e.preventDefault();

		tracker.slider('value', 0);

		stopAudio();

		var next = $('.playlist li.active').next();
		if (next.length == 0) {
			next = $('.playlist li:first-child');
		}
		initAudio(next);
	});

	// rewind click
	$('.fa-backward').click(function (e) {
		e.preventDefault();

		stopAudio();

		var prev = $('.playlist li.active').prev();
		if (prev.length == 0) {
			prev = $('.playlist li:last-child');
		}
		initAudio(prev);
	});

	$('.playlist li').click(function (e) {
		stopAudio();
		initAudio($(this));
	});

	// initialization - first element in playlist
	initAudio($('.playlist li:first-child'));

	// set volume
	song.volume = 0.8;

	// initialize the volume slider
	volume.slider({
		range: 'min',
		min: 1,
		max: 100,
		value: 80,
		start: function(event,ui) {},
		slide: function(event, ui) {
			song.volume = ui.value / 100;
		},
		stop: function(event,ui) {},
	});

	// empty tracker slider
	tracker.slider({
		range: 'min',
		min: 0, max: 10,
		start: function(event,ui) {},
		slide: function(event, ui) {
			song.currentTime = ui.value;
		},
		stop: function(event,ui) {}
	});
});