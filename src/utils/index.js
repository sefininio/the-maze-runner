module.exports.getTikalId = (user) => {
    let tikalId;
    if (user.provider) {
        tikalId = `${user.provider}-${user.id}`;
    } else {
        tikalId = user.id;
    }

    const encoded = Buffer.from(tikalId, 'utf8');
    return encoded.toString('base64');
};

