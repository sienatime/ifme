class ProfilePicture
  def self.fetch(avatar, class_name)
    default = "/assets/default_ifme_avatar.png"

    if avatar
      if avatar.include?('/assets/contributors/')
        profile = avatar
      else
        img_url = avatar
        res = Net::HTTP.get_response(URI.parse(img_url))
        img_url = default unless res.code.to_f >= 200 && res.code.to_f < 400
        profile = img_url
      end
    else
      profile = default
    end

    result = "<div class='" + class_name.to_s + "' style='background: url(" + profile + ")'></div>"

    return result.html_safe
  end
end
