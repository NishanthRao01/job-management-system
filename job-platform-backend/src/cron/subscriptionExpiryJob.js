const cron = require("node-cron");

const Subscription =
    require("../models/Subscription");

const User =
    require("../models/User");

const runSubscriptionExpiryJob =
    () => {

        cron.schedule(
            "0 * * * *",
            async () => {

                console.log(
                    "Running subscription expiry job..."
                );

                const expiredSubscriptions =
                    await Subscription.find({
                        status: "active",
                        endDate: {
                            $lt: new Date(),
                        },
                    });

                for (const subscription of expiredSubscriptions) {

                    // mark subscription expired
                    subscription.status =
                        "expired";

                    await subscription.save();

                    // get client
                    const client =
                        await User.findById(
                            subscription.clientId
                        );

                    if (
                        client &&
                        client.assignedAssociate
                    ) {

                        // decrement associate workload
                        await User.findByIdAndUpdate(
                            client.assignedAssociate,
                            {
                                $inc: {
                                    clientsCount: -1,
                                },
                            }
                        );

                        // remove assignment
                        client.assignedAssociate =
                            null;

                        await client.save();
                        
                        await createAuditLog({
                            action: "SUBSCRIPTION_EXPIRED",
                        
                            targetUser:
                                subscription.clientId,
                        
                            details: {
                                subscriptionId:
                                    subscription._id,
                            },
                        });

                    }

                    console.log(
                        `Expired subscription processed: ${subscription._id}`
                    );

                }

            }
        );

    };

module.exports =
    runSubscriptionExpiryJob;