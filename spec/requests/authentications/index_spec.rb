describe '/authentications' do
	describe 'admin' do
		before(:each) do
			visit '/'
			@admin = FactoryGirl.build(:admin)
			@admin.save
		end
		it "should be able to login and be redirected to resource /social_stocks" do
			current_path.should eq '/'
			within 'body' do
				fill_in('Email', :with => @admin.email)
		    fill_in('Password', :with => @admin.password)
		    click_button 'Sign in'
		  end
		  current_path.should eq social_stocks_path
		end
	end
end