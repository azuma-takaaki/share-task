class IconImage < ActiveRecord::Base
  mount_uploader :image, ImageUploader
end
