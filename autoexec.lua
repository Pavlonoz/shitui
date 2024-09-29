-- Auto-execute script to poll for remote script execution commands
_G.pollServer = function()
    while true do
        local success, result = pcall(function()
            return game:HttpGet("http://localhost:8000/poll")
        end)

        if success and result then
            local response = game:GetService("HttpService"):JSONDecode(result)
            if response.script then
                -- Ensure that the script content is not nil
                if response.script ~= nil and response.script ~= "" then
                    loadstring(response.script)()
                else
                    warn("Received an empty script.")
                end
            end
        else
            warn("Failed to fetch from server:", result)
        end

        -- Poll every 5 seconds
        wait(5)
    end
end
print("on")
-- Start polling
_G.pollServer()
print("on")