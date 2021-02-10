function verify_url() {
    var todays_date = new Date();
    $("todays_date").value = todays_date.toISOString().split('T')[0];

    var p = Object.fromEntries(new URLSearchParams(location.search));
    var cert_data = p.d;
    var cert_signature = p.s;

    if (cert_data === '' || cert_signature === '')
        return;

    $("certificate_data").value = cert_data;
    $("certificate_data_signature").value = cert_signature;

    var data_array = cert_data.split('.');
    $("ex_issue_date").value = data_array[0];
    $("ex_course_code").value = data_array[1];
    $("ex_id").value = data_array[2];
    $("ex_first_name").value = data_array[3];
    $("ex_last_name").value = data_array[4];
    $("ex_birth_date").value = data_array[5];

    var course = getCourseByCode($("ex_course_code").value);

    var issue_date = new Date(data_array[0]);
    var expiry_date = new Date(issue_date).addMonths(parseInt(course.months_valid));


    $("com_course_name").value = course.name;
    $("com_months_valid").value = course.months_valid;
    $("com_expiry_date").value = expiry_date.toISOString().split('T')[0];

    var selected_key = select_verifying_key(issue_date);
    $("public_verifying_key").value = selected_key.hex_string;
    $("public_verifying_key_ts").value = selected_key.issue_timestamp + " to " + selected_key.expiry_timestamp;

    var verifier = new KJUR.crypto.Signature({alg: "SHA256withECDSA", prov: "cryptojs/jsrsa"});
    verifier.init({xy: selected_key.hex_string, curve: "secp256r1"});
    verifier.updateString(cert_data);
    var signature_ok = verifier.verify(cert_signature);
    var date_ok = todays_date <= expiry_date;

    update_status(signature_ok, date_ok);

}

function select_verifying_key(certificate_issue_date) {
    var cert_date = new Date(certificate_issue_date);
    var selected_key = null;
    public_keys.forEach(function(key, index, array) {
        var key_ts_issue = new Date(key.issue_timestamp);
        var key_ts_expiry = new Date(key.expiry_timestamp);
        if (cert_date >= key_ts_issue && cert_date <= key_ts_expiry)
            selected_key = key;
    });
    return selected_key;
}

function update_status(sig_ok, date_ok) {
    if (sig_ok) {
        if(date_ok) {
            $("certificate_data_help").innerText = "DATA SIGNATURE VERIFICATION SUCCESS AND CERTIFICATE IS IN DATE!";
            $("certificate_data").classList.remove("is-warning");
            $("certificate_data_help").classList.remove("is-warning");
            $("certificate_data").classList.add("is-success");
            $("certificate_data_help").classList.add("is-success");

            $("certificate_data_signature_help").innerText = "SIGNATURE IS VALID!";
            $("certificate_data_signature").classList.remove("is-warning");
            $("certificate_data_signature_help").classList.remove("is-warning");
            $("certificate_data_signature").classList.add("is-success");
            $("certificate_data_signature_help").classList.add("is-success");

        } else {
            $("certificate_data_help").innerText = "DATA SIGNATURE VERIFICATION SUCCESS BUT CERTIFICATE IS PAST EXPIRY DATE!";

            $("certificate_data_signature_help").innerText = "SIGNATURE IS VALID!";
            $("certificate_data_signature").classList.remove("is-warning");
            $("certificate_data_signature_help").classList.remove("is-warning");
            $("certificate_data_signature").classList.add("is-success");
            $("certificate_data_signature_help").classList.add("is-success");
        }
    } else {
        $("certificate_data_help").innerText = "DATA SIGNATURE VERIFICATION FAILED! CERTIFICATE MAY BE COUNTERFEIT!";
        $("certificate_data").classList.add("is-danger");
        $("certificate_data_help").classList.add("is-danger");

        $("certificate_data_signature_help").innerText = "SIGNATURE IS INVALID!";
        $("certificate_data_signature").classList.add("is-danger");
        $("certificate_data_signature_help").classList.add("is-danger");
    }
}

window.addEventListener('load', () => {
    verify_url();
});