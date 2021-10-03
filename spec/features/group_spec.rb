require 'rails_helper'

feature "Groups" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end



  example "Groupの検索予測が表示される" do
    @group = FactoryBot.create(:programming)
    expect(@group.valid?)
    visit "/"
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    expect(page).to have_content "programming"
    sleep 1
  end


  example "存在するグループ名で新しいグループを作成しようとするとエラーメッセージが表示される" do
    @group = FactoryBot.create(:programming)
    expect(@group.valid?)
    visit "/"
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    click_button "＋group"
    fill_in "新しいグループの名前", with:"programming"
    click_button "グループを作成"
    expect(page).to have_content "その名前のグループは既に存在します"
  end

  example "作成したグループが即座にマイグループ欄へ反映される" do
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    click_button "＋group"
    fill_in "新しいグループの名前", with:"programming"
    click_button "グループを作成"
    expect(page).to have_content "programming"
  end

  example "作成したグループの画面が正しく表示される" do
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    click_button "＋group"
    fill_in "新しいグループの名前", with:"programming"
    click_button "グループを作成"
    click_button "programming"
    expect(find('.group-name').text).to eq 'programming'
  end

  example "検索したGroupをクリックするとそのグループのページが表示される" do
    visit "/"
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    click_button "＋group"
    fill_in "新しいグループの名前", with:"プログラミング"
    click_button "グループを作成"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("プログ")
    sleep 1
    click_button "プログラミング"
    expect(find('.group-name').text).to eq 'プログラミング'
  end


  example "グループ検索窓が空の時, 城の数が多い上位10グループが表示される" do
    @groups = []
    @user = FactoryBot.create(:user)
    @groups_number = 20
    for i in 1..@groups_number do
      @groups[i] = FactoryBot.create(:group, name: "group"+ i.to_s)
      for n in 1..i do
        FactoryBot.create(:castle0, name: "group"+ i.to_s + "_castle" + n.to_s,
                          castle_part_point: 0,
                          user: @user,
                          group: @groups[i])
      end
    end
    visit "/"
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    for i in 11..@groups_number do
      page.find('.switch-group-button', text: "group"+ i.to_s)
    end
    find("input[placeholder='グループを探す']").set("group")
    page.find('.switch-group-button', text: "group10")
    page.find('.switch-group-button', text: "group" + @groups_number.to_s)
    find("input[placeholder='グループを探す']").set("")
    for i in 11..@groups_number do
      page.find('.switch-group-button', text: "group"+ i.to_s)
    end
    sleep 1
  end

  example "グループの名前が空白の場合エラーメッセージが出力される" do
    visit "/"
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    click_button "＋group"
    click_button "グループを作成"
    expect(page).to have_content "グループ名を入力してください"
  end

end
