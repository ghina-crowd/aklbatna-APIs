var IncentivesRepository = require('../repository/incentives');
var ContactRepository = require('../service/contactus');

var CompanyRepository = require('../repository/company');

var DealsRepository = require('../service/deals');
var PurchaseRepository = require('../service/purcahse');
module.exports = {

    get: async function () {
        return new Promise(async function (resolve, reject) {
            await IncentivesRepository.get().then(async incentives => {

                await incentives.forEach(async element => {



                    await ContactRepository.getWhere(element['dataValues'].company_id).then((async contacts => {

                        // element['dataValues'].target = company['dataValues'].target

                        var total = 0;
                        var current = 0;

                        await contacts.forEach(async contact => {
                            if (contact['dataValues'].subject == 0) {
                                total = total + 1;
                            }
                            if (contact['dataValues'].company_id == element['dataValues'].company_id && contact['dataValues'].subject == 0) {
                                current = current + 1;
                            }
                        });



                        var percentage = current * total / 100;
                        element['dataValues'].complains = percentage;


                        await DealsRepository.get_deal_by_id_company(element['dataValues'].company_id).then((async deals => {
                            console.log(deals);
                            var total = 0;
                            var count = 0;

                            await deals.forEach(async deal => {
                                total = total + 1;
                                count = count + deal['dataValues'].final_rate;
                            });

                            console.log("deals");
                            console.log(total);
                            console.log(count);
                            element['dataValues'].rate_count = count / total;

                            await PurchaseRepository.GetAllByCompany(element['dataValues'].company_id).then((async purchase => {
                                console.log("purchase");
                                var countPurchase = 0;
                                var countVourcher = 0;
                                await purchase.forEach(async purchase => {

                                    if (purchase['dataValues'].status == 0) {
                                        countPurchase = countPurchase + 1;
                                        // console.log(countPurchase);

                                        if (purchase['dataValues'].sub_deal) {
                                            countVourcher = countVourcher + purchase['dataValues'].sub_deal['dataValues'].voucher;
                                        }
                                    }

                                });

                                await CompanyRepository.get_company(element['dataValues'].company_id).then(async company => {
                                    console.log("countPurchase");
                                    console.log(countPurchase);
                                    var percentage = company['dataValues'].target * countPurchase / 100;
                                    var percentageVourcher = countVourcher / countPurchase ;
                                    element['dataValues'].reach = percentage;
                                    element['dataValues'].percentageVourcher = percentageVourcher;
                                    element['dataValues'].countPurchaseUsed = countPurchase;
    
                                    element['dataValues'].target = company['dataValues'].target;
                                    element['dataValues'].company_name_en = company['dataValues'].company_name_en;
                                    element['dataValues'].company_name_ar = company['dataValues'].company_name_ar;
                                    element['dataValues'].cost_type = company['dataValues'].cost_type;
                                    
                                    resolve(incentives);
                                })

                            }))
                        }));



                    }));
                });


            }, error => {
                reject(error);
            });
        });
    },
    get_by: async function (company_id) {
        return new Promise(async function (resolve, reject) {

            IncentivesRepository.get_by(company_id).then(async incentives => {
                await ContactRepository.getWhere(incentives['dataValues'].company_id).then((async contacts => {

                    // element['dataValues'].target = company['dataValues'].target

                    var total = 0;
                    var current = 0;

                    await contacts.forEach(async contact => {
                        if (contact['dataValues'].subject == 0) {
                            total = total + 1;
                        }
                        if (contact['dataValues'].company_id == incentives['dataValues'].company_id && contact['dataValues'].subject == 0) {
                            current = current + 1;
                        }
                    });



                    var percentage = current * total / 100;
                    incentives['dataValues'].complains = percentage;


                    await DealsRepository.get_deal_by_id_company(incentives['dataValues'].company_id).then((async deals => {
                        console.log(deals);
                        var total = 0;
                        var count = 0;

                        await deals.forEach(async deal => {
                            total = total + 1;
                            count = count + deal['dataValues'].final_rate;
                        });

                        console.log("deals");
                        console.log(total);
                        console.log(count);
                        incentives['dataValues'].rate_count = count / total;

                        await PurchaseRepository.GetAllByCompany(incentives['dataValues'].company_id).then((async purchase => {

                            console.log("purchase['dataValues'].status");

                            var countPurchase = 0;
                            var countVourcher = 0;
                            await purchase.forEach(async purchase => {



                                if (purchase['dataValues'].sub_deal) {
                                    countVourcher = countVourcher + purchase['dataValues'].sub_deal['dataValues'].voucher;
                                }
                                if (purchase['dataValues'].status == 0) {
                                    countPurchase = countPurchase + 1;
                                }


                                // if (purchase['dataValues'].status);

                            });

                            await CompanyRepository.get_company(incentives['dataValues'].company_id).then(async company => {
                                console.log("countPurchase");
                                console.log(countPurchase);
                                var percentage = company['dataValues'].target * countPurchase / 100;
                                var percentageVourcher = countVourcher / countPurchase ;
                                incentives['dataValues'].reach = percentage;
                                incentives['dataValues'].percentageVourcher = percentageVourcher;
                                incentives['dataValues'].countPurchaseUnused = countPurchase;

                                incentives['dataValues'].target = company['dataValues'].target;
                                incentives['dataValues'].company_name_en = company['dataValues'].company_name_en;
                                incentives['dataValues'].company_name_ar = company['dataValues'].company_name_ar;
                                incentives['dataValues'].cost_type = company['dataValues'].cost_type;
                                resolve(incentives);
                            })

                        }))
                    }));



                }));
            }, error => {
                reject(error);
            });
        });
    },
    update_company: function (credentials) {
        return new Promise(function (resolve, reject) {
            IncentivesRepository.update_incentives(credentials).then(incentives => {
                resolve(incentives);
            }, error => {
                reject(error);
            });
        });
    },
    create_incentives: function (newCompanyData) {
        return new Promise(function (resolve, reject) {
            IncentivesRepository.create_incentives(newCompanyData).then(company => {
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },

};