var onReadyAddComment = function() {
	if (isShow(['moments', 'strategies', 'meetings'])) {
		$(document).on('click', '#add_comment_button', function(event) {
			event.preventDefault();

			if (!$(this).prop('disabled')) {
				$(this).prop('disabled', true);
				$('#comment_comment').prop('disabled', true);
				$(this).val(I18n.t('comment.posting'));

				if ($('.comment').length > 0) {
					$('.actions').removeClass('no_margin_bottom');
				}

				var url;
				if (isShow(['moments'])) {
					url = '/moments/comment';
				} else if (isShow(['strategies'])) {
					url = '/strategies/comment';
				} else {
					url = '/meetings/comment';
				}

				var viewers;
				if ($('#comment_viewers').length) {
					viewers = $('#comment_viewers').val();
				}

				var data = {
					comment_type: $('#comment_comment_type').val(),
					commented_on:$('#comment_commented_on').val(),
					comment_by: $('#comment_comment_by').val(),
					comment: $('#comment_comment').val(),
					visibility: $('#comment_visibility').val(),
					viewers: viewers
				};

				$.ajax({
				    dataType: 'json',
				    url: url,
				    type: 'POST',
				    data: data,
				    success: function(json) {
				    	if (json !== undefined) {
				    		$('#add_comment_button').prop('disabled', false);
				    		$('#comment_comment').prop('disabled', false);
				    		$('#comment_comment').val('');
							$('#add_comment_button').val(I18n.t('comment.singular'));

				    		if (!json.no_save) {
					    		var commentid = 'comment_' + json.commentid;
					    		var profile_picture = json.profile_picture;
					    		var comment_info = json.comment_info;
					    		var profile_name = json.profile_name;
					    		var profile_path = json.profile_path;
					    		var time_ago = json.time_ago;
					    		var comment_text = json.comment_text;
					    		var visibility = json.visibility;
					    		var delete_comment = json.delete_comment;

					    		// Remove no_margin_top on first comment
					    		if ($('.comment').length > 0) {
					    			$('.comment.no_margin_top').removeClass('no_margin_top');
					    		}

					    		var newComment = '<div class="comment no_margin_top" id="' + commentid + '">';
					    		newComment += '<div class="table">';
					    		newComment += '<div class="table_row">';

					    		newComment += '<div class="table_cell small_profile_picture_div vertical_align_middle padding_right">';

					    		newComment += profile_picture;
					    		newComment += '</div>';

					    		newComment += '<div class="table_cell">';
					    		newComment += '<div class="comment_info">';

					    		newComment += '<a href="' + profile_path + '">';
					    		newComment += profile_name;
					    		newComment += '</a> - ' + time_ago;

					    		newComment += '</div>';
					    		newComment += '<div class="comment_text">';
					    		newComment += comment_text;
					    		newComment += '</div>';
					    		if (visibility !== null && visibility.length > 0) {
					    			newComment += visibility;
					    		}
					    		newComment += '</div>';


					    		if (delete_comment) {
					    			newComment += '<div class="table_cell delete_comment">';
					    			newComment += '<a href="" id="' + delete_comment + '" class="delete_comment_button"><i class="fa fa-times"></i></a>';
										newComment += '</div>'
					    		}

					    		newComment += '</div>';
					    		newComment += '</div>';
					    		newComment += '</div>';

					    		$('#comments').prepend(newComment);

					    		if ($('.comment').length > 0) {
									$('.actions').removeClass('no_margin_bottom');
								}
					    	}
				    	}
				    },
				    error: function() {
				    	$('#add_comment_button').prop('disabled', false);
				    	$('#comment_comment').prop('disabled', false);
						$('#add_comment_button').val(I18n.t('comment.singular'));
				    }
				});
			}
		});
	}
};

$(document).on("page:load ready", onReadyAddComment);
