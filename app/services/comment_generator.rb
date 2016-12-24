class CommentGenerator
  attr_reader :data, :data_type, :current_user

  def initialize(data, data_type, current_user)
    @data = data
    @data_type = data_type
    @current_user = current_user
    @profile = User.find(data.comment_by)
  end

  def build
    { commentid: @data.id,
      profile_picture: ProfilePicture.fetch(@profile.avatar.url,
                                            'mini_profile_picture'),
      profile_name: profile_name,
      profile_path: profile_path,
      time_ago: TimeAgo.formatted_ago(@data.created_at),
      comment_text: ActionController::Base.helpers.raw(@data.comment),
      visibility: visibility,
      delete_comment: can_delete_comment? ? @data.id.to_s : nil,
      no_save: false }
  end

  private

  def profile_name
    if should_show_not_allies?
      I18n.t('shared.comments.not_allies', name: @profile.name)
    else
      @profile.name
    end
  end

  def should_show_not_allies?
    !are_allies? && @current_user.id != @data.comment_by
  end

  def visibility
    if @data_type == 'moment'
      CommentVisibility.new(data,
                            Moment.find(@data.commented_on),
                            @current_user).build
    elsif @data_type == 'strategy'
      CommentVisibility.new(data,
                            Strategy.find(@data.commented_on),
                            @current_user).build
    end
  end

  def profile_path
    Rails.application.routes.url_helpers.profile_index_path(
      uid: get_uid(@data.comment_by)
    )
  end

  def can_delete_comment?
    (@data_type == 'moment' && (Moment.where(id: data.commented_on, userid: @current_user.id).exists? || @data.comment_by == @current_user.id)) || (@data_type == 'strategy' && (Strategy.where(id: @data.commented_on, userid: @current_user.id).exists? || @data.comment_by == @current_user.id)) || (@data_type == 'meeting' && (MeetingMember.where(meetingid: @data.commented_on, userid: @current_user.id, leader: true).exists? || @data.comment_by == @current_user.id))
  end

  def get_uid(userid)
    User.where(id: userid).first.uid
  end

  def are_allies?
    userid1_allies = User.find(@current_user.id).allies_by_status(:accepted)
    userid1_allies.include? User.find(@data.comment_by)
  end
end
