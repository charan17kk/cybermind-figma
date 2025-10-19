// Test script to debug the exact login issue
// This simulates what the frontend login page is doing

console.log('=== Frontend Login Simulation ===');

// Step 1: Test form data
const testFormData = {
    email: 'vinay@gmail.com',
    password: 'Vinay@123'
};

console.log('Form data:', { email: testFormData.email, password: '***' });

// Step 2: Test API module import
async function testAPIImport() {
    try {
        console.log('Testing API module import...');
        
        // This won't work directly in browser but will help us understand the issue
        const module = await import('./src/lib/api.js');
        console.log('API module imported successfully:', Object.keys(module));
        return module;
    } catch (error) {
        console.error('API import failed:', error);
        throw error;
    }
}

// Step 3: Test API call directly (bypassing import)
async function testDirectAPICall() {
    console.log('Testing direct API call...');
    
    const API_BASE_URL = 'http://localhost:5000/api';
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testFormData)
        });
        
        console.log('Direct API response status:', response.status);
        console.log('Direct API response ok:', response.ok);
        
        const data = await response.json();
        console.log('Direct API response data:', data);
        
        return data;
    } catch (error) {
        console.error('Direct API call failed:', error);
        throw error;
    }
}

// Step 4: Test the complete flow
async function testCompleteFlow() {
    console.log('\n=== Testing Complete Login Flow ===');
    
    try {
        // Test direct API call first
        const directResult = await testDirectAPICall();
        
        if (directResult.success) {
            console.log('✅ Direct API call successful');
            console.log('Token received:', directResult.data?.token ? 'YES' : 'NO');
            
            // Test localStorage
            if (directResult.data?.token) {
                localStorage.setItem('authToken', directResult.data.token);
                console.log('✅ Token saved to localStorage');
                
                const retrievedToken = localStorage.getItem('authToken');
                console.log('✅ Token retrieved from localStorage:', retrievedToken ? 'YES' : 'NO');
            }
            
            if (directResult.data?.user) {
                localStorage.setItem('currentUser', JSON.stringify(directResult.data.user));
                console.log('✅ User data saved to localStorage');
            }
            
        } else {
            console.log('❌ Direct API call failed:', directResult.message || directResult.error);
        }
        
        // Now test API import
        try {
            const apiModule = await testAPIImport();
            console.log('✅ API module import successful');
        } catch (importError) {
            console.log('❌ API module import failed (expected in browser)');
            console.log('This explains why the frontend login might be failing');
        }
        
    } catch (error) {
        console.error('❌ Complete flow test failed:', error);
    }
}

// Run the test
testCompleteFlow().then(() => {
    console.log('\n=== Test Complete ===');
    console.log('If direct API call worked but import failed, the issue is with module loading');
}).catch(error => {
    console.error('Test failed:', error);
});