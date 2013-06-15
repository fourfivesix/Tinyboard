/*
 *expand.js
 * https://github.com/savetheinternet/Tinyboard/blob/master/js/expand.js
 *
 * Released under the MIT license
 * Copyright (c) 2012 Michael Save <savetheinternet@tinyboard.org>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/expand.js';
 *
 */

$(document).ready(function(){
	if($('div.banner').length != 0)
		return; // not index
	
	$('div.post.op span.omitted').each(function() {
		$(this)
			.html($(this).text().replace(/Click reply to view\./, '<a href="javascript:void(0)">Click to expand</a>.'))
			.find('a').click(function() {
				var thread = $(this).parent().parent().parent();
				var id = thread.attr('id').replace(/^thread_/, '');
				$.ajax({
					url: thread.find('p.intro a.post_no:first').attr('href'),
					context: document.body,
					success: function(data) {
						var last_expanded = false;
						$(data).find('div.post.reply').each(function() {
							if($('#' + $(this).attr('id')).length == 0) {
								if(last_expanded) {
									$(this).addClass('expanded').insertAfter(last_expanded).before('<br class="expanded">');
								} else {
									$(this).addClass('expanded').insertAfter(thread.find('div.post:first')).after('<br class="expanded">');
								}
								last_expanded = $(this);
								
								$(document).trigger('new_post', this);
							}
						});
						$('<span class="omitted"><a href="javascript:void(0)">Hide expanded replies</a>.</span>')
							.insertAfter(thread.find('span.omitted').css('display', 'none'))
							.click(function() {
								thread.find('.expanded').remove();
								$(this).prev().css('display', '');
								$(this).remove();
							});
					}
				});
			});
	});
});
