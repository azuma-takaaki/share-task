# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
10.times do |n|
    User.create(
      email: "test_user#{n + 1}@test.com",
      name: "テストユーザー#{n + 1}",
      password: "test_user#{n + 1}",
      icon:"icon_"+rand(0...10).to_s+".png"
    )
end


User.create(
  email: "engineer@engineer.com",
  name: "100日後にエンジニアになる人",
  password: "engineer",
  icon:"icon_"+rand(0...10).to_s+".png"
)

User.create(
  email: "ReactReact@React.com",
  name: "React使い",
  password: "ReactReact",
  icon:"icon_"+rand(0...10).to_s+".png"
)

User.create(
  email: "magicmagic@magicmagic.com",
  name: "魔法使い",
  password: "magicmagic",
  icon:"icon_"+rand(0...10).to_s+".png"
)

Group.create(
  name: "programming"
)

@user = User.find_by(name: "100日後にエンジニアになる人")
@group = Group.find_by(name: "programming")

Castle.create(
  name: "プログラミング",
  user_id: @user.id,
  group_id: @group.id
)

@castle = Castle.find_by(name: "プログラミング")
@castle.castle_part_point = 12
@castle.save

report_list = [{content: "プログラミングを1分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを2分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを3分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを4分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを5分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを6分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを7分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを8分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを9分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを10分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを11分勉強した", castle_id: @castle.id, user_id: @user.id},
               {content: "プログラミングを12分勉強した", castle_id: @castle.id, user_id: @user.id}
              ]
report_list.each do |report|
    Report.create(report)
end

prices_list = [{three_d_model_name: "castle.glb", displayed_name: "城の門", castle_part_point: 1, ruby_point: 0},
               {three_d_model_name: "wall_01.glb", displayed_name: "城の壁", castle_part_point: 1, ruby_point: 0}
              ]
prices_list.each do |price|
  CastlePartPrice.create(price)
end
