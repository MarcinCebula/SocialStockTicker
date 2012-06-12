desc "This task is called by the Heroku scheduler add-on"
task :update_feed => :environment do
    puts "Update Stock Records..."
    Stock.update_ptat_score
    puts "done."
end
