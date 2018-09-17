#### Data Manipulation to convert into D3's required format
require(dplyr) 

#Read the data
flight_data<-read.csv('/Users/Downloads/2008.csv')



#Table for Pie Chart
cancel_agg<-flight_data %>% filter(Cancelled!=0) %>% count(CancellationCode)
cancel_agg$percentage<-cancel_agg$n/(sum(cancel_agg$n))
cancel_agg$n<-NULL
cancel_agg$CancellationCode<-as.character(cancel_agg$CancellationCode)

names(cancel_agg)<-c('category','measure')

cancel_agg[cancel_agg=='A']<-'Carrier'
cancel_agg[cancel_agg=='B']<-'Weather'
cancel_agg[cancel_agg=='C']<-'NAS'
cancel_agg[cancel_agg=='D']<-'Security'


#Table for Line Chart
cancel_agg_month<-flight_data %>% filter(Cancelled!=0) %>% count(CancellationCode,Month)
cancel_agg_month_all<-flight_data %>% filter(Cancelled!=0) %>% count(Month)
cancel_agg_month_all$CancellationCode<-'All'
cancel_agg_month_all<-cancel_agg_month_all[,c(3,1,2)]
cancel_agg_month<-rbind(cancel_agg_month,cancel_agg_month_all)
rm(cancel_agg_month_all)
names(cancel_agg_month)<-c('group','category','measure')
cancel_agg_month$group<-as.character(cancel_agg_month$group)
cancel_agg_month<-cancel_agg_month[order(cancel_agg_month$category,cancel_agg_month$group,cancel_agg_month$measure),]

cancel_agg_month[cancel_agg_month=='A']<-'Carrier'
cancel_agg_month[cancel_agg_month=='B']<-'Weather'
cancel_agg_month[cancel_agg_month=='C']<-'NAS'
cancel_agg_month[cancel_agg_month=='D']<-'Security'


#Table for Bar Chart
cancel_agg_dow<-flight_data %>% filter(Cancelled!=0) %>% count(CancellationCode,DayOfWeek)
cancel_agg_dow_all<-flight_data %>% filter(Cancelled!=0) %>% count(DayOfWeek)
cancel_agg_dow_all$CancellationCode<-'All'
cancel_agg_dow_all<-cancel_agg_dow_all[,c(3,1,2)]
cancel_agg_dow<-rbind(cancel_agg_dow,cancel_agg_dow_all)
rm(cancel_agg_dow_all)
names(cancel_agg_dow)<-c('group','category','measure')
cancel_agg_dow$group<-as.character(cancel_agg_dow$group)
cancel_agg_dow<-cancel_agg_dow[order(cancel_agg_dow$category,cancel_agg_dow$group,cancel_agg_dow$measure),]

cancel_agg_dow[cancel_agg_dow=='A']<-'Carrier'
cancel_agg_dow[cancel_agg_dow=='B']<-'Weather'
cancel_agg_dow[cancel_agg_dow=='C']<-'NAS'
cancel_agg_dow[cancel_agg_dow=='D']<-'Security'

cancel_agg_dow[cancel_agg_dow$category==1,2]<-'Monday'
cancel_agg_dow[cancel_agg_dow$category==2,2]<-'Tuesday'
cancel_agg_dow[cancel_agg_dow$category==3,2]<-'Wednesday'
cancel_agg_dow[cancel_agg_dow$category==4,2]<-'Thursday'
cancel_agg_dow[cancel_agg_dow$category==5,2]<-'Friday'
cancel_agg_dow[cancel_agg_dow$category==6,2]<-'Saturday'
cancel_agg_dow[cancel_agg_dow$category==7,2]<-'Sunday'


#We need to create a string for the javascript array

to_js_input<-function(df){
  string<-NULL
  if(ncol(df)==3){
  for (i in 1:nrow(df)){
    string<-paste(string, '{ group: \"',df$group[i], '\" , category: \"' , df$category[i], '\" , measure: ', df$measure[i], '}, \n', sep='')
  }
  } else {
    for (i in 1:nrow(df)){
      string<-paste(string, '{ category: \"' , df$category[i], '\" , measure: ', df$measure[i], '}, \n', sep='')
    }
  }
  return(string)
}

pie_chart_text<-to_js_input(cancel_agg)
line_chart_text<-to_js_input(cancel_agg_month)
bar_chart_text<-to_js_input(cancel_agg_dow)

writeLines(pie_chart_text, "piechart.txt")
writeLines(line_chart_text, "linechart.txt")
writeLines(bar_chart_text, "barchart.txt")


