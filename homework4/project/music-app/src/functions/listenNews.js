module.exports = async function (context, mySbMsg) {
    const topicName = context.bindingData.userProperties.topicName;
    const subscriptionName = context.bindingData.subscriptionName;

    console.log(`Received message from topic: ${topicName} with subscription: ${subscriptionName}`);
    console.log(`Message Body: ${mySbMsg}`);

    const signalRMessage = {
        target: 'newMessage',
        arguments: [{ topicName, subscriptionName, message: mySbMsg }]
    };

    context.bindings.signalRMessages = [signalRMessage];

    context.res = {
        status: 200,
        body: { message: "Message sent to client successfully" }
    };
};
