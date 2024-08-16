const request = async () => {
    try {
        return await fetch('someurl');
    } finally {
        return null;
    }
}

const data = await request();
