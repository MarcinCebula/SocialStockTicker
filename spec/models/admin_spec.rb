require 'spec_helper'

describe Admin do
# it { should validate the presance of :email }
	it "should validate the presance of :email" do
		lambda { 
			admin = FactoryGirl.build(:admin, :email => "")
			admin.save!
		}.should raise_error(Mongoid::Errors::Validations, "Validation failed - Email can't be blank.")
	end
# it { should validate_uniqueness_of :email }
	it "should validate_uniqueness_of of :email" do
		admin = FactoryGirl.create(:admin)

		lambda { 
			admin = FactoryGirl.build(:admin)
			admin.save!
		}.should raise_error(Mongoid::Errors::Validations, "Validation failed - Email is already taken.")
	end

# it { should validate_format_of :email }
	it "should validate_format_of :email" do
		lambda { 
		admin = FactoryGirl.build(:admin, :email => "bademail.com")
			admin.save!
		}.should raise_error(Mongoid::Errors::Validations, "Validation failed - Email is invalid.")

	end

  it { should ensure_length_of(:password).is_at_least(6) }

  it "should create a valid admin account" do
		lambda { 
			admin = FactoryGirl.build(:admin)
			admin.save!
		}.should_not raise_error(Mongoid::Errors::Validations, "Validation failed - Email can't be blank.")
  end
end