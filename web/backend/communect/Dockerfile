FROM eclipse-temurin:17-jdk-alpine

RUN mkdir /opt/communect

COPY ./communect/ /opt/communect/tmp
WORKDIR /opt/communect/tmp

RUN apk add --no-cache dos2unix && dos2unix ./gradlew
RUN ./gradlew dependencies --no-daemon
RUN ./gradlew bootJar --no-daemon
RUN mv /opt/communect/tmp/build/libs/communect-0.0.1-SNAPSHOT.jar /opt/communect/communect.jar

WORKDIR /opt/communect
RUN rm -r /opt/communect/tmp

ENTRYPOINT ["java","-jar","/opt/communect/communect.jar"]
