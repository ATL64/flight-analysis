library(randomForest)
library(caret)
library(pROC)
library(dplyr)
library(tidyr)

test_roc <- function(model, data) {
  roc(data$output,
      predict(model, data, type = "prob")[, "purchase"])
}

flight_data<-read.csv('/Users/Downloads/2008.csv')


#Create data for training. Given my current computer limitations, I will take the data size down (of course we could easily spin up a powerful VM on the cloud and run it on a bigger dataset).
set.seed(2018) #For reproducibility
flight_data<-flight_data[sample(nrow(flight_data), 4000), ]

flight_data$Year<-NULL
flight_data$Month<-as.factor(flight_data$Month)
flight_data$DayofMonth<-as.factor(flight_data$DayofMonth)
flight_data$DayOfWeek<-as.factor(flight_data$DayOfWeek)
flight_data$DepTime<-NULL # We just want to use the reserved departure time
flight_data$CRSDepTime<-as.character(flight_data$CRSDepTime)
flight_data$CRSDepTime<-substr(flight_data$CRSDepTime,1,nchar(flight_data$CRSDepTime)-2) #Rounding to hour
flight_data$CRSDepTime<-as.factor(flight_data$CRSDepTime)
flight_data$ArrTime<-NULL
flight_data$CRSArrTime<-as.character(flight_data$CRSArrTime)
flight_data$CRSArrTime<-substr(flight_data$CRSArrTime,1,nchar(flight_data$CRSArrTime)-2)
flight_data$CRSArrTime<-as.factor(flight_data$CRSArrTime)
flight_data$FlightNum<-NULL
flight_data$TailNum<-NULL # Too high dimensional to take care of in this simple exploration
flight_data$ActualElapsedTime<-NULL
flight_data$AirTime<-NULL
flight_data$ArrDelay<-NULL
flight_data$DepDelay<-NULL
flight_data$Origin<-NULL #As before too high dimensional
flight_data$Dest<-NULL
flight_data$TaxiIn<-NULL
flight_data$TaxiOut<-NULL
flight_data$CancellationCode<-NULL
flight_data$Diverted<-NULL
flight_data$CarrierDelay<-NULL
flight_data$WeatherDelay<-NULL
flight_data$NASDelay<-NULL
flight_data$SecurityDelay<-NULL
flight_data$LateAircraftDelay<-NULL

sum(flight_data$Cancelled) #Only 91 cancelled, unbalanced dataset.



flight_data$Cancelled<-as.factor(flight_data$Cancelled)
levels(flight_data$Cancelled)<-c('not_cancelled','cancelled')


train <- flight_data[1:1000,]
test  <- flight_data[1001:2000,]

row.has.na <- apply(test, 1, function(x){any(is.na(x))})
sum(row.has.na)
test <- test[!row.has.na,]
row.has.na <- apply(train, 1, function(x){any(is.na(x))})
sum(row.has.na)
test <- train[!row.has.na,]

prop.table(table(train$Cancelled))

ctrl <- trainControl(method = "repeatedcv",
                     number = 10,
                     repeats = 5,
                     summaryFunction = twoClassSummary,
                     classProbs = TRUE)
# Let's try a random forest and check variable importance

set.seed(2222)

rf_fit <- train(Cancelled ~ .,
                data = train,
                method = "rf",
                verbose = FALSE,
                metric = "ROC",
                trControl = ctrl)


names(test)

rf_fit %>%
  test_roc(data = test) %>%
  auc()


reference<-test$Cancelled
predictions<-predict(rf_fit, test)  

confusionMatrix(predictions,reference)



#Area under the curve: 0.8324

fm <- rf_fit$finalModel
varImp(fm)

