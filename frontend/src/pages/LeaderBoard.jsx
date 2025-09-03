import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getJWTToken } from '../utils'

const LeaderBoard = () => {
  return (
    <React.Fragment>
        <Navbar />
        <div className="w-screen min-h-screen flex justify-center items-center">
            <LeaderboardTable />
        </div>
        <Footer />
    </React.Fragment>
  )
}

const LeaderboardTable = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);

    const JWTToken = getJWTToken();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTToken}`
            }
        }).then((res) => {
            if (!res.ok) {
                setError(true)
                throw new Error("Leaderboard not fetched")
            } else {
                return res.json();
            }
        }).then((res) => {
            setLeaderboard(res.data.leaderboard);
            setLoading(false)
        }).catch((err) => {
            setError(true)
            throw new Error("Leaderboard not fetched: ", err);
        })
    }, [JWTToken])

    if (loading) return <div className="">Loading...</div>

    if (error) return <div className="">Error Raised!!</div>

    return (
        <React.Fragment>
            <div className="leaderboard-table-wrapper flex justify-center items-center w-full h-full">
                <table className='w-11/12 lg:w-5/6 text-left border-2 border-white'>
                    <tr className='border-2 border-white bg-white text-black text-xl'>
                        <th>Rank</th>
                        <th>Name</th>
                        <th className=''>Stream</th>
                        <th className=''>Institution</th>
                        <th className=''>Stars</th>
                    </tr>
                    <tbody className=''>
                        {leaderboard.map((entry) => (
                            <tr className="" key={entry._id}>
                                <td className='text-center'>{entry.rank}</td>
                                <td className='p-3'>{entry.name}</td>
                                <td className=''>{entry.stream}</td>
                                <td className=''>{entry.institution}</td>
                                <td className=''>{entry.starsGathered}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}

export default LeaderBoard