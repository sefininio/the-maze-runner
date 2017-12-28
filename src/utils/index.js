module.exports.getTikalId = (user) => {
    const tikalId = `${user.provider}-${user.id}`;
    const encoded = Buffer.from(tikalId, 'utf8');
    return encoded.toString('base64');
};

